import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const cities = await prisma.board.findMany({
      where: {
        type: 'CITY',
        city: { not: null },
        state: { not: null }
      },
      select: {
        id: true,
        city: true,
        state: true,
        posts: {
          select: { id: true }
        }
      },
      orderBy: [
        { city: 'asc' },
        { state: 'asc' }
      ]
    })

    // Transform data to match the expected format
    const transformedCities = cities.map(board => ({
      id: board.id,
      name: board.city!,
      state: board.state!,
      postCount: board.posts.length
    }))

    return NextResponse.json({ cities: transformedCities })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
