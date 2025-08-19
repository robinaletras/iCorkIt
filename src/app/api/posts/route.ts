import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAndRunUpkeep } from '@/lib/database-upkeep'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('boardId')
    const authorId = searchParams.get('authorId')

    let whereClause: any = {}
    
    if (boardId) {
      whereClause.boardId = boardId
    } else if (authorId) {
      // For social posts (no boardId), filter by authorId
      whereClause.authorId = authorId
      whereClause.boardId = null
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
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
        },
        pins: {
          where: { isActive: true },
          orderBy: { endDate: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform posts to include pin information
    const postsWithPins = posts.map(post => {
      const activePin = post.pins[0]
      const now = new Date()
      
      return {
        ...post,
        isPinned: !!activePin,
        pinEndDate: activePin?.endDate || null,
        pinDaysRemaining: activePin ? Math.ceil((new Date(activePin.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0
      }
    })

    // Run database upkeep to clean up expired pins
    await checkAndRunUpkeep()

    return NextResponse.json({ posts: postsWithPins })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
