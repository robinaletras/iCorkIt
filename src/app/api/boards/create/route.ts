import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

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

    const { name, description, type, level, country, state, city, zipCode, isPublic } = await request.json()

    // Validation
    if (!name || !type || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Business rule: Only location boards (CITY level) or social boards can be user-created
    if ((type !== 'CITY' && type !== 'SOCIAL') || (type === 'CITY' && level !== 'CITY')) {
      return NextResponse.json(
        { error: 'Only location boards or social boards can be created by users' },
        { status: 403 }
      )
    }

    // Require location details for CITY boards
    if (type === 'CITY' && (!zipCode || !city || !state)) {
      return NextResponse.json(
        { error: 'zipCode, city, and state are required for location boards' },
        { status: 400 }
      )
    }

    // For SOCIAL boards, location is optional
    if (type === 'SOCIAL') {
      // Social boards can be location-based or completely virtual
      // If they provide location, validate it
      if (zipCode || city || state) {
        if (!zipCode || !city || !state) {
          return NextResponse.json(
            { error: 'If providing location for social board, all location fields are required' },
            { status: 400 }
          )
        }
      }
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Normalize inputs
    const normalizedZip = String(zipCode || '').trim()
    const normalizedCity = String(city || '').trim()
    const normalizedState = String(state || '').trim()

    // Check if a board already exists for this location (by ZIP or City+State)
    const existingBoard = await prisma.board.findFirst({
      where: {
        OR: [
          // Only check location conflicts for CITY boards or SOCIAL boards with location
          ...(type === 'CITY' || (type === 'SOCIAL' && zipCode) ? [
            { zipCode: normalizedZip },
            {
              AND: [
                { type: 'CITY' },
                { city: { equals: normalizedCity } },
                { state: { equals: normalizedState } }
              ]
            }
          ] : [])
        ]
      }
    })

    if (existingBoard) {
      return NextResponse.json(
        { error: 'A board with this name or location already exists' },
        { status: 409 }
      )
    }

    // Create the board
    const board = await prisma.board.create({
      data: {
        name: name,
        type: type,
        description: description,
        city: type === 'SOCIAL' && !zipCode ? null : normalizedCity,
        state: type === 'SOCIAL' && !zipCode ? null : normalizedState,
        zipCode: type === 'SOCIAL' && !zipCode ? null : normalizedZip,
        country: country || 'USA',
        isPrivate: type === 'SOCIAL',
        ownerId: type === 'SOCIAL' ? decoded.userId : null,
        // Location boards require admin approval
        isApproved: type === 'SOCIAL' ? true : false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true
          }
        }
      }
    })

    return NextResponse.json({ 
      board,
      message: type === 'SOCIAL' 
        ? 'Social board created successfully!' 
        : 'Location board submitted for admin approval. You will be notified once approved.'
    })
  } catch (error) {
    console.error('Board creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
