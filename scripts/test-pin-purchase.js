const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

async function testPinPurchase() {
  try {
    console.log('🧪 Testing pin purchase API...')
    
    // Clean up any existing test data
    await cleanupTestData()
    
    // Create test user
    const testUser = await createTestUser()
    console.log('✅ Created test user:', testUser.email)
    
    // Generate JWT token for the test user
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      jwtSecret,
      { expiresIn: '1h' }
    )
    
    console.log('🔑 Generated JWT token')
    
    // Test social pin pack purchase
    console.log('\n📌 Testing social pin pack purchase...')
    
    const userBeforeSocialPurchase = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance before social purchase:', userBeforeSocialPurchase)
    
    const socialPurchaseResponse = await purchasePinPack('SOCIAL', 25, token)
    console.log('📌 Social pin purchase response:', socialPurchaseResponse)
    
    const userAfterSocialPurchase = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance after social purchase:', userAfterSocialPurchase)
    
    // Test regular pin pack purchase
    console.log('\n📌 Testing regular pin pack purchase...')
    
    const userBeforeRegularPurchase = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance before regular purchase:', userBeforeRegularPurchase)
    
    const regularPurchaseResponse = await purchasePinPack('REGULAR', 25, token)
    console.log('📌 Regular pin purchase response:', regularPurchaseResponse)
    
    const userAfterRegularPurchase = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance after regular purchase:', userAfterRegularPurchase)
    
    // Check purchase records
    const purchases = await prisma.pinPurchase.findMany({
      where: { userId: testUser.id },
      orderBy: { purchaseDate: 'asc' }
    })
    console.log('\n📋 Purchase records:', purchases)
    
    console.log('\n🎉 Pin purchase test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function purchasePinPack(packType, packSize, token) {
  try {
    const response = await fetch('http://localhost:3002/api/pins/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        packType: packType,
        packSize: packSize
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
  
  // Delete test purchases
  await prisma.pinPurchase.deleteMany({
    where: {
      user: { email: { contains: 'test-pin-purchase' } }
    }
  })
  
  // Delete test users
  await prisma.user.deleteMany({
    where: {
      email: { contains: 'test-pin-purchase' }
    }
  })
}

async function createTestUser() {
  return await prisma.user.create({
    data: {
      email: 'test-pin-purchase@example.com',
      displayName: 'Test User',
      password: 'hashedpassword',
      socialPins: 200,
      pinPacks: 0,
      isAdmin: false
    }
  })
}

// Run the test
testPinPurchase()
