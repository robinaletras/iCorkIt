require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

async function testPinAPI() {
  try {
    console.log('🧪 Testing pin creation API...')
    
    // Debug environment variables
    console.log('🔍 Environment check:')
    console.log('  - NODE_ENV:', process.env.NODE_ENV)
    console.log('  - JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined')
    console.log('  - JWT_SECRET preview:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 20) + '...' : 'undefined')
    
    // Clean up any existing test data
    await cleanupTestData()
    
    // Create test user
    const testUser = await createTestUser()
    console.log('✅ Created test user:', testUser.email)
    
    // Create test social board
    const socialBoard = await createSocialBoard(testUser.id)
    console.log('✅ Created social board:', socialBoard.name)
    
    // Create test city board
    const cityBoard = await createCityBoard()
    console.log('✅ Created city board:', cityBoard.name)
    
    // Create test posts
    const socialPost = await createTestPost(testUser.id, socialBoard.id, 'SOCIAL')
    const cityPost = await createTestPost(testUser.id, cityBoard.id, 'ADVERTISEMENT')
    console.log('✅ Created test posts')
    
    // Generate JWT token for the test user
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
    console.log('🔑 Using JWT_SECRET:', jwtSecret ? jwtSecret.substring(0, 10) + '...' : 'undefined')
    
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      jwtSecret,
      { expiresIn: '1h' }
    )
    
    console.log('🔑 Generated JWT token:', token.substring(0, 20) + '...')
    console.log('🔑 Token payload:', JSON.stringify(jwt.decode(token), null, 2))
    
    // Test social pin creation through API
    console.log('\n📌 Testing social pin creation through API...')
    
    const userBeforeSocialPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance before social pin:', userBeforeSocialPin)
    
    // Call the pin creation API for social board (use valid duration: 3 days)
    const socialPinResponse = await createPinViaAPI(socialPost.id, socialBoard.id, 3, token)
    console.log('📌 Social pin API response:', socialPinResponse)
    
    const userAfterSocialPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance after social pin:', userAfterSocialPin)
    
    // Test regular pin creation through API
    console.log('\n📌 Testing regular pin creation through API...')
    
    const userBeforeRegularPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance before regular pin:', userBeforeRegularPin)
    
    // Call the pin creation API for city board (use valid duration: 1 day)
    const regularPinResponse = await createPinViaAPI(cityPost.id, cityBoard.id, 1, token)
    console.log('📌 Regular pin API response:', regularPinResponse)
    
    const userAfterRegularPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance after regular pin:', userAfterRegularPin)
    
    console.log('\n🎉 Pin API test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function createPinViaAPI(postId, boardId, days, token) {
  try {
    const response = await fetch('http://localhost:3002/api/pins/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        postId: postId,
        boardId: boardId,
        daysPinned: days
      })
    })
    
    if (response.ok) {
      return await response.json()
    } else {
      const error = await response.text()
      return { error: error, status: response.status }
    }
  } catch (error) {
    return { error: error.message }
  }
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...')
  
  // Delete test pins
  await prisma.pin.deleteMany({
    where: {
      OR: [
        { post: { author: { email: { contains: 'test-pin-api' } } } },
        { post: { title: { contains: 'Test Post' } } }
      ]
    }
  })
  
  // Delete test posts
  await prisma.post.deleteMany({
    where: {
      OR: [
        { author: { email: { contains: 'test-pin-api' } } },
        { title: { contains: 'Test Post' } }
      ]
    }
  })
  
  // Delete test boards
  await prisma.board.deleteMany({
    where: {
      OR: [
        { name: { contains: 'Test Social Board' } },
        { name: { contains: 'Test City Board' } }
      ]
    }
  })
  
  // Delete test users
  await prisma.user.deleteMany({
    where: {
      email: { contains: 'test-pin-api' }
    }
  })
}

async function createTestUser() {
  return await prisma.user.create({
    data: {
      email: 'test-pin-api@example.com',
      displayName: 'Test User',
      password: 'hashedpassword',
      socialPins: 200,
      pinPacks: 0,
      isAdmin: false
    }
  })
}

async function createSocialBoard(userId) {
  return await prisma.board.create({
    data: {
      name: 'Test Social Board',
      type: 'SOCIAL',
      description: 'Test social board for pin system testing',
      socialOwnerId: userId,
      isApproved: true
    }
  })
}

async function createCityBoard() {
  return await prisma.board.create({
    data: {
      name: 'Test City Board',
      type: 'CITY',
      description: 'Test city board for pin system testing',
      city: 'Test City',
      state: 'TS',
      country: 'USA',
      isApproved: true
    }
  })
}

async function createTestPost(authorId, boardId, type) {
  return await prisma.post.create({
    data: {
      title: `Test Post - ${type}`,
      content: `This is a test ${type.toLowerCase()} post for testing the pin system.`,
      type: type,
      boardId: boardId,
      authorId: authorId,
      positionX: 100,
      positionY: 100
    }
  })
}

// Run the test
testPinAPI()
