import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { checkAndRunUpkeep } from '@/lib/database-upkeep'
import { headers } from 'next/headers'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_cy7HmRKVwfw0eslItuwBPOBX84SD593a'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    let event: any

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received Stripe webhook event:', event.type)

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    const { userId, packType, packSize } = paymentIntent.metadata
    
    if (!userId || !packType || !packSize) {
      console.error('Missing metadata in payment intent:', paymentIntent.id)
      return
    }

    // Check if purchase already exists
    const existingPurchase = await prisma.pinPurchase.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id }
    })

    if (existingPurchase) {
      console.log('Purchase already processed for payment intent:', paymentIntent.id)
      return
    }

    // Create pin purchase record
    const pinPurchase = await prisma.pinPurchase.create({
      data: {
        userId: userId,
        packSize: parseInt(packSize),
        price: paymentIntent.amount / 100, // Convert from cents
        stripePaymentIntentId: paymentIntent.id
      }
    })

    // Update user's pin balance
    if (packType === 'SOCIAL') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          socialPins: {
            increment: parseInt(packSize)
          }
        }
      })
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          pinPacks: {
            increment: parseInt(packSize)
          }
        }
      })
    }

    // Run database upkeep
    await checkAndRunUpkeep()

    console.log('Successfully processed payment for user:', userId, 'Pack:', packType, packSize)

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment failed for intent:', paymentIntent.id)
  // Could implement retry logic or user notification here
}

async function handlePaymentIntentCanceled(paymentIntent: any) {
  console.log('Payment canceled for intent:', paymentIntent.id)
  // Could implement cleanup logic here
}
