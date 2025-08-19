import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const type = searchParams.get('type')
    const socialOwnerId = searchParams.get('socialOwnerId')

    let whereClause: any = {}

    // Handle different board types
    if (type === 'SOCIAL') {
      // For social boards, filter by socialOwnerId
      whereClause.type = 'SOCIAL'
      if (socialOwnerId) {
        whereClause.socialOwnerId = socialOwnerId
      }
    } else {
      // For other board types, exclude social boards
      whereClause.type = { in: ['NATIONAL', 'STATE', 'CITY'] }
      
      if (city) {
        whereClause.city = city
      }
      if (state) {
        whereClause.state = state
      }
      if (type && type !== 'all') {
        whereClause.type = type
      }
    }

    const boards = await prisma.board.findMany({
      where: whereClause,
      include: {
        posts: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to match the expected format
    const transformedBoards = boards.map(board => ({
      id: board.id,
      name: board.name,
      type: board.type,
      description: board.description || '',
      city: board.city,
      state: board.state,
      country: board.country,
      postCount: board.posts.length,
      memberCount: 0, // TODO: Implement member counting
      isPrivate: false, // TODO: Implement privacy
      location: board.city && board.state ? `${board.city}, ${board.state}` : board.state || board.city,
      tags: [], // TODO: Implement tags
      featured: false, // TODO: Implement featured logic
      lastActivity: board.updatedAt.toISOString(),
      slug: board.type === 'SOCIAL' ? `social/${board.id}` : `${board.type.toLowerCase()}/${board.city || board.state || 'unknown'}`
    }))

    return NextResponse.json({ boards: transformedBoards })
  } catch (error) {
    console.error('Error fetching boards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, city, state, country, description } = await request.json()

    // Validation
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Check if board already exists
    if (type === 'CITY' && city) {
      const existingBoard = await prisma.board.findFirst({
        where: {
          type: 'CITY',
          city: city
        }
      })

      if (existingBoard) {
        return NextResponse.json(
          { error: 'Board already exists for this city' },
          { status: 409 }
        )
      }
    }

    // Create new board
    const board = await prisma.board.create({
      data: {
        name,
        type,
        city: city || null,
        state: state || null,
        country: country || 'USA',
        description: description || null
      }
    })

    // Return the created board in the same format as GET
    const transformedBoard = {
      id: board.id,
      name: board.name,
      type: board.type,
      description: board.description || '',
      city: board.city,
      state: board.state,
      country: board.country,
      postCount: 0,
      memberCount: 0,
      isPrivate: false,
      location: board.city && board.state ? `${board.city}, ${board.state}` : board.state || board.city,
      tags: [],
      featured: false,
      lastActivity: board.updatedAt.toISOString(),
      slug: board.type === 'SOCIAL' ? `social/${board.id}` : `${board.type.toLowerCase()}/${board.city || board.state || 'unknown'}`
    }

    return NextResponse.json(transformedBoard, { status: 201 })
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
