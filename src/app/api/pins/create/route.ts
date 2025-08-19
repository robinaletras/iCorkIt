import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAndRunUpkeep } from '@/lib/database-upkeep'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { postId, boardId, daysPinned } = await request.json()
    
    if (!postId || !boardId || !daysPinned) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, boardId, daysPinned' },
        { status: 400 }
      )
    }

    // Validate daysPinned
    if (![1, 3, 7].includes(daysPinned)) {
      return NextResponse.json(
        { error: 'daysPinned must be 1, 3, or 7' },
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

    // Get user with pin balances
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        socialPins: true,
        pinPacks: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get board to check if it's a social board
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { type: true }
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    const isSocialBoard = board.type === 'SOCIAL'
    const pinsUsed = daysPinned

    // Check if user has enough pins
    if (isSocialBoard) {
      // For social boards, check social pins
      if (user.socialPins < pinsUsed) {
        return NextResponse.json(
          { error: `Insufficient social pins. You need ${pinsUsed} pins but have ${user.socialPins}.` },
          { status: 400 }
        )
      }
    } else {
      // For location boards, check pin packs
      if (user.pinPacks < pinsUsed) {
        return NextResponse.json(
          { error: `Insufficient pin packs. You need ${pinsUsed} pins but have ${user.pinPacks}.` },
          { status: 400 }
        )
      }
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
        { error: 'You can only pin your own posts' },
        { status: 403 }
      )
    }

    // Check if post is already pinned and extend it if possible
    const existingPin = await prisma.pin.findFirst({
      where: { 
        postId,
        isActive: true,
        boardId: boardId
      }
    })

    if (existingPin) {
      // Calculate new end date by adding days to existing end date
      const newEndDate = new Date(existingPin.endDate)
      newEndDate.setDate(newEndDate.getDate() + daysPinned)
      
      // Check if total days would exceed 7
      const totalDays = Math.ceil((newEndDate.getTime() - existingPin.startDate.getTime()) / (1000 * 60 * 60 * 24))
      if (totalDays > 7) {
        return NextResponse.json(
          { error: 'Cannot pin for more than 7 days total. This post is already pinned and adding days would exceed the limit.' },
          { status: 400 }
        )
      }
      
      // Extend the existing pin
      const updatedPin = await prisma.pin.update({
        where: { id: existingPin.id },
        data: {
          endDate: newEndDate,
          daysPinned: existingPin.daysPinned + daysPinned,
          updatedAt: new Date()
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              author: {
                select: {
                  id: true,
                  displayName: true
                }
              }
            }
          }
        }
      })
      
      // Deduct pins from user based on board type
      if (isSocialBoard) {
        // For social boards, deduct from social pins
        await prisma.user.update({
          where: { id: decoded.userId },
          data: {
            socialPins: {
              decrement: pinsUsed
            }
          }
        })
      } else {
        // For location boards, deduct from pin packs
        await prisma.user.update({
          where: { id: decoded.userId },
          data: {
            pinPacks: {
              decrement: pinsUsed
            }
          }
        })
      }
      
      return NextResponse.json({
        message: 'Pin extended successfully',
        pin: updatedPin
      }, { status: 200 })
    }

    // Create new pin
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + daysPinned)

    const newPin = await prisma.pin.create({
      data: {
        postId,
        boardId,
        userId: decoded.userId,
        pinType: isSocialBoard ? 'SOCIAL' : 'REGULAR',
        pinsUsed,
        daysPinned,
        endDate,
        isActive: true
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                displayName: true
              }
            }
          }
        }
      }
    })

    // Deduct pins from user based on board type
    if (isSocialBoard) {
      // For social boards, deduct from social pins
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          socialPins: {
            decrement: pinsUsed
          }
        }
      })
    } else {
      // For location boards, deduct from pin packs
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          pinPacks: {
            decrement: pinsUsed
          }
        }
      })
    }

    // Run database upkeep to clean up expired pins
    await checkAndRunUpkeep()

    return NextResponse.json({
      message: 'Post pinned successfully',
      pin: newPin
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating pin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
