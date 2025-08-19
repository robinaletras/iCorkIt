import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAndRunUpkeep } from '@/lib/database-upkeep'
import { stripe } from '@/lib/stripe'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { packType, packSize, paymentMethodId } = await request.json()
    
    if (!packType || !packSize) {
      return NextResponse.json(
        { error: 'Missing required fields: packType, packSize' },
        { status: 400 }
      )
    }

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing payment method' },
        { status: 400 }
      )
    }

    // Validate pack types
    if (!['SOCIAL', 'REGULAR'].includes(packType)) {
      return NextResponse.json(
        { error: 'Invalid pack type. Must be SOCIAL or REGULAR' },
        { status: 400 }
      )
    }

    // Validate pack sizes
    const validPackSizes = packType === 'SOCIAL' ? [25] : [25, 100, 500]
    if (!validPackSizes.includes(packSize)) {
      return NextResponse.json(
        { error: `Invalid pack size for ${packType} pins. Valid sizes: ${validPackSizes.join(', ')}` },
        { status: 400 }
      )
    }

    // Get JWT token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      console.error('JWT verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        displayName: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate price based on pack type and size
    let price: number
    let description: string
    
    if (packType === 'SOCIAL') {
      // Social pins: $10 for 25 pins
      price = 10.00
      description = `${packSize} Social Pins - Reusable pins for your personal board`
    } else {
      // Regular pins: $25 for 25, $90 for 100, $400 for 500
      switch (packSize) {
        case 25:
          price = 25.00
          description = `${packSize} Regular Pins - Consumable pins for location boards`
          break
        case 100:
          price = 90.00
          description = `${packSize} Regular Pins - Consumable pins for location boards (10% savings)`
          break
        case 500:
          price = 400.00
          description = `${packSize} Regular Pins - Consumable pins for location boards (20% savings)`
          break
        default:
          return NextResponse.json(
            { error: 'Invalid pack size for regular pins' },
            { status: 400 }
          )
      }
    }

    try {
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100), // Convert to cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${request.nextUrl.origin}/purchase-success`,
        metadata: {
          userId: user.id,
          packType: packType,
          packSize: packSize.toString(),
          description: description
        },
        description: description
      })

      if (paymentIntent.status === 'succeeded') {
        // Payment successful - create pin purchase record
        const pinPurchase = await prisma.pinPurchase.create({
          data: {
            userId: user.id,
            packSize: packSize,
            price: price,
            stripePaymentIntentId: paymentIntent.id
          }
        })

        // Update user's pin balance
        if (packType === 'SOCIAL') {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              socialPins: {
                increment: packSize
              }
            }
          })
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              pinPacks: {
                increment: packSize
              }
            }
          })
        }

        // Run database upkeep
        await checkAndRunUpkeep()

        return NextResponse.json({
          message: 'Pin pack purchased successfully',
          purchase: {
            id: pinPurchase.id,
            packType: packType,
            packSize: packSize,
            price: price,
            purchaseDate: pinPurchase.purchaseDate,
            stripePaymentIntentId: paymentIntent.id
          }
        }, { status: 201 })

      } else if (paymentIntent.status === 'requires_action') {
        // Payment requires additional action (3D Secure, etc.)
        return NextResponse.json({
          requiresAction: true,
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret
        }, { status: 200 })

      } else {
        // Payment failed
        return NextResponse.json({
          error: 'Payment failed',
          status: paymentIntent.status
        }, { status: 400 })
      }

    } catch (stripeError: any) {
      console.error('Stripe payment error:', stripeError)
      
      if (stripeError.type === 'StripeCardError') {
        return NextResponse.json({
          error: stripeError.message || 'Card payment failed'
        }, { status: 400 })
      } else if (stripeError.type === 'StripeInvalidRequestError') {
        return NextResponse.json({
          error: 'Invalid payment request'
        }, { status: 400 })
      } else {
        return NextResponse.json({
          error: 'Payment processing failed. Please try again.'
        }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('Error purchasing pin pack:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
