import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json()

    // Validate input
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Email, password, and display name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user with initial pins
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        displayName: displayName, // Use the provided display name
        password: hashedPassword,
        socialPins: 200,
        pinPacks: 0,
        isAdmin: false
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        socialPins: true,
        pinPacks: true,
        isAdmin: true
      }
    })

    // Create a social board for this user
    const socialBoard = await prisma.board.create({
      data: {
        name: `${displayName}'s Social Board`,
        type: 'SOCIAL',
        description: `Personal social board for ${displayName}`,
        socialOwnerId: user.id,
        isApproved: true // Social boards are auto-approved
      }
    })

    console.log('Created social board:', socialBoard.id, 'for user:', user.id)

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Return user data (excluding password) and token
    const userData = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      socialPins: user.socialPins,
      pinPacks: user.pinPacks,
      isAdmin: user.isAdmin
    }

    return NextResponse.json({
      success: true,
      user: userData,
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
