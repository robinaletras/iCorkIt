const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

async function testStripeIntegration() {
  try {
    console.log('🧪 Testing Stripe integration...')
    
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
    
    // Test the purchase API with a mock payment method ID
    console.log('\n📌 Testing purchase API with Stripe integration...')
    
    const userBeforePurchase = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: { socialPins: true, pinPacks: true }
    })
    console.log('📊 User pin balance before purchase:', userBeforePurchase)
    
    // Note: This will fail because we need a real Stripe payment method ID
    // But it will test the API structure and validation
    try {
      const response = await fetch('http://localhost:3002/api/pins/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packType: 'SOCIAL',
          packSize: 25,
          paymentMethodId: 'pm_test_invalid' // This will cause a Stripe error
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('📌 Purchase response:', result)
      } else {
        const error = await response.text()
        console.log('📌 Expected error response:', error)
      }
    } catch (error) {
      console.log('📌 Network error (expected if server not running):', error.message)
    }
    
    // Check if webhook endpoint exists
    console.log('\n🔗 Testing webhook endpoint...')
    try {
      const webhookResponse = await fetch('http://localhost:3002/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'test-signature'
        },
        body: JSON.stringify({ test: 'data' })
      })
      console.log('🔗 Webhook response status:', webhookResponse.status)
    } catch (error) {
      console.log('🔗 Webhook test (expected if server not running):', error.message)
    }
    
    console.log('\n🎉 Stripe integration test completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Test the purchase modal in the browser')
    console.log('3. Use Stripe test card: 4242 4242 4242 4242')
    console.log('4. Check webhook handling in server logs')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...')
  
  // Delete test purchases
  await prisma.pinPurchase.deleteMany({
    where: {
      user: { email: { contains: 'test-stripe' } }
    }
  })
  
  // Delete test users
  await prisma.user.deleteMany({
    where: {
      email: { contains: 'test-stripe' }
    }
  })
}

async function createTestUser() {
  return await prisma.user.create({
    data: {
      email: 'test-stripe@example.com',
      displayName: 'Test Stripe User',
      password: 'hashedpassword',
      socialPins: 200,
      pinPacks: 0,
      isAdmin: false
    }
  })
}

// Run the test
testStripeIntegration()
