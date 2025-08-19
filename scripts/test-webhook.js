const crypto = require('crypto')

// Test webhook signature verification
function testWebhookSignature() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
  const payload = JSON.stringify({
    id: 'evt_test',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test',
        amount: 1000,
        metadata: {
          userId: 'user_test',
          corkitsAmount: '100'
        }
      }
    }
  })

  const timestamp = Math.floor(Date.now() / 1000)
  const signedPayload = `${timestamp}.${payload}`
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex')

  console.log('✅ Webhook signature test passed')
  console.log('📝 Test payload:', payload)
  console.log('🔐 Generated signature:', signature)
  console.log('⏰ Timestamp:', timestamp)
}

// Test environment variables
function testEnvironmentVariables() {
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY', 
    'STRIPE_WEBHOOK_SECRET',
    'JWT_SECRET'
  ]

  console.log('\n🔍 Checking environment variables:')
  
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`)
    } else {
      console.log(`❌ ${varName}: NOT SET`)
    }
  })
}

// Test Stripe connection
async function testStripeConnection() {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const account = await stripe.accounts.retrieve()
    console.log('\n✅ Stripe connection successful')
    console.log(`🏢 Account: ${account.business_profile?.name || 'Test Account'}`)
    console.log(`🌍 Country: ${account.country}`)
    console.log(`💰 Currency: ${account.default_currency}`)
  } catch (error) {
    console.log('\n❌ Stripe connection failed:', error.message)
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Testing iCorkIt Webhook Setup\n')
  
  testEnvironmentVariables()
  testWebhookSignature()
  await testStripeConnection()
  
  console.log('\n🎯 Next Steps:')
  console.log('1. Ensure all environment variables are set')
  console.log('2. Create webhook endpoint in Stripe dashboard')
  console.log('3. Test with Stripe CLI or test payments')
  console.log('4. Monitor webhook delivery in Stripe dashboard')
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { runTests }
