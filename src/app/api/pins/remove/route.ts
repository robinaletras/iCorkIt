import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { postId, boardId } = await request.json()
    
    if (!postId || !boardId) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, boardId' },
        { status: 400 }
      )
    }

    // Get JWT token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      console.error('JWT verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if post exists and user owns it
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        authorId: true
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only unpin your own posts' },
        { status: 403 }
      )
    }

    // Find and remove the active pin
    const activePin = await prisma.pin.findFirst({
      where: { 
        postId,
        isActive: true,
        boardId: boardId
      }
    })

    if (!activePin) {
      return NextResponse.json(
        { error: 'No active pin found for this post' },
        { status: 404 }
      )
    }

    // Get board type to determine if pins should be returned
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { type: true }
    })

    // Deactivate the pin
    await prisma.pin.update({
      where: { id: activePin.id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    // For social boards, return the pins to the user
    let pinsReturned = 0
    if (board?.type === 'SOCIAL') {
      pinsReturned = activePin.pinsUsed
    }

    return NextResponse.json({
      message: 'Post unpinned successfully',
      pinsReturned: pinsReturned
    }, { status: 200 })

  } catch (error) {
    console.error('Error removing pin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
