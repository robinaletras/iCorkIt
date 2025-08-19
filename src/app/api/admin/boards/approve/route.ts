import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyJWT(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isAdmin: true }
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { boardId, approved, rejectionReason } = await request.json()

    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid approval status' }, { status: 400 })
    }

    const updateData: any = {
      isApproved: approved,
      approvedBy: decoded.userId,
      approvedAt: new Date()
    }

    if (!approved && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    const board = await prisma.board.update({
      where: { id: boardId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ board })
  } catch (error) {
    console.error('Error updating board approval:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
