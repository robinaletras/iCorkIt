import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAndRunUpkeep } from '@/lib/database-upkeep'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    if (!decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { 
      title, 
      content, 
      type, 
      boardId = null, 
      location = '', 
      category = '', 
      tags = [], 
      images = [], 
      attachments = []
    } = await request.json()

    console.log('Received post data:', { title, content, type, boardId, location, category, tags, images, attachments })

    // Validation
    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // boardId is always required - it determines where the post goes
    if (!boardId) {
      return NextResponse.json(
        { error: 'boardId is required' },
        { status: 400 }
      )
    }

    // Create post
    const postData = {
      title,
      content,
      type,
      boardId: boardId || null, // Allow null for social board posts
      location,
      category,
      tags: tags ? JSON.stringify(tags) : '[]',
      images: images ? JSON.stringify(images) : '[]',
      attachments: attachments ? JSON.stringify(attachments) : '[]',
      authorId: decoded.userId,
      // Give new posts random positions so they don't overlap
      positionX: Math.floor(Math.random() * 600) + 50, // 50-650px range
      positionY: Math.floor(Math.random() * 400) + 50, // 50-450px range
      updatedAt: new Date() // Explicitly set updatedAt
    }
    
    console.log('Creating post with data:', postData)
    
    const post = await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: {
            id: true,
            displayName: true
          }
        },
        board: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    })

    // Run database upkeep to clean up expired pins
    await checkAndRunUpkeep()

    return NextResponse.json(
      { 
        message: 'Post created successfully',
        post 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Post creation error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
