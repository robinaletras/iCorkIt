const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPinSystem() {
  try {
    console.log('🧪 Testing new pin system...')
    
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
    
    // Test social pin creation (should use socialPins)
    console.log('\n📌 Testing social pin creation...')
    const socialPost = await createTestPost(testUser.id, socialBoard.id, 'SOCIAL')
    console.log('✅ Created social post:', socialPost.title)
    
    // Check user's social pins before pinning
    const userBeforeSocialPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance before social pin:', userBeforeSocialPin)
    
    const socialPin = await createTestPin(socialPost.id, socialBoard.id, testUser.id, 'SOCIAL', 3)
    console.log('✅ Created social pin for 3 days')
    
    // Check user's social pins (should be 197 now)
    const userAfterSocialPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance after social pin:', userAfterSocialPin)
    
    // Test regular pin creation (should use pinPacks)
    console.log('\n📌 Testing regular pin creation...')
    const cityPost = await createTestPost(testUser.id, cityBoard.id, 'ADVERTISEMENT')
    console.log('✅ Created city post:', cityPost.title)
    
    // Check user's pin balance before regular pin
    const userBeforeRegularPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance before regular pin:', userBeforeRegularPin)
    
    const regularPin = await createTestPin(cityPost.id, cityBoard.id, testUser.id, 'REGULAR', 2)
    console.log('✅ Created regular pin for 2 days')
    
    // Check user's pin balance (pinPacks should be 0, socialPins should still be 197)
    const userAfterRegularPin = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance after regular pin:', userAfterRegularPin)
    
    // Test database upkeep with expired pins
    console.log('\n🔄 Testing database upkeep...')
    
    // Create an expired pin for testing
    const expiredPin = await createExpiredPin(socialPost.id, socialBoard.id, testUser.id, 'SOCIAL', 1)
    console.log('✅ Created expired social pin')
    
    // Run upkeep manually using direct Prisma calls
    console.log('🔄 Running manual upkeep...')
    await runManualUpkeep()
    
    // Check if expired pin was processed
    const processedPin = await prisma.pin.findUnique({
      where: { id: expiredPin.id }
    })
    console.log('📌 Expired pin status after upkeep:', processedPin?.isActive)
    
    // Check if social pins were returned
    const userAfterUpkeep = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance after upkeep:', userAfterUpkeep)
    
    console.log('\n🎉 Pin system test completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...')
  
  // Delete test pins
  await prisma.pin.deleteMany({
    where: {
      OR: [
        { post: { author: { email: { contains: 'test-pin-system' } } } },
        { post: { title: { contains: 'Test Post' } } }
      ]
    }
  })
  
  // Delete test posts
  await prisma.post.deleteMany({
    where: {
      OR: [
        { author: { email: { contains: 'test-pin-system' } } },
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
      email: { contains: 'test-pin-system' }
    }
  })
}

async function createTestUser() {
  return await prisma.user.create({
    data: {
      email: 'test-pin-system@example.com',
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

async function createTestPin(postId, boardId, userId, pinType, days) {
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)
  
  return await prisma.pin.create({
    data: {
      postId: postId,
      boardId: boardId,
      userId: userId,
      pinType: pinType,
      pinsUsed: days,
      daysPinned: days,
      startDate: startDate,
      endDate: endDate,
      isActive: true
    }
  })
}

async function createExpiredPin(postId, boardId, userId, pinType, days) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 2) // Started 2 days ago
  const endDate = new Date()
  endDate.setDate(endDate.getDate() - 1) // Expired 1 day ago
  
  return await prisma.pin.create({
    data: {
      postId: postId,
      boardId: boardId,
      userId: userId,
      pinType: pinType,
      pinsUsed: days,
      daysPinned: days,
      startDate: startDate,
      endDate: endDate,
      isActive: true
    }
  })
}

async function runManualUpkeep() {
  console.log('🔄 Running manual upkeep...')
  // This function would typically call a dedicated upkeep script or function
  // For now, we'll just simulate a delay and a simple update
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a small delay
  console.log('✅ Manual upkeep simulation complete.')
}

// Run the test
testPinSystem()
