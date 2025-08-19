import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  console.log('Position update API called for post:', params.postId)
  
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Auth header present:', !!authHeader)
    
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

    const { positionX, positionY } = await request.json()

    console.log('Received position data:', { positionX, positionY, typeX: typeof positionX, typeY: typeof positionY })

    // Validate position data
    if (typeof positionX !== 'number' || typeof positionY !== 'number') {
      console.log('Invalid position data types:', { positionX, positionY, typeX: typeof positionX, typeY: typeof positionY })
      return NextResponse.json(
        { error: 'Invalid position data' },
        { status: 400 }
      )
    }

    // Get the post to verify ownership
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user owns the post
    if (post.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only move your own posts' },
        { status: 403 }
      )
    }

    // Update the post position using Prisma update
    console.log('Updating post with Prisma...')
    
    const updatedPost = await prisma.post.update({
      where: { id: params.postId },
      data: {
        positionX: positionX,
        positionY: positionY,
        updatedAt: new Date()
      }
    })

    console.log('Post position updated successfully:', updatedPost)

    return NextResponse.json({
      message: 'Post position updated successfully'
    })

  } catch (error) {
    console.error('Post position update error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type',
      params: { postId: params.postId }
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
