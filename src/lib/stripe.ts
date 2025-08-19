import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
})

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_51RoSL0FMw6pWHVm7fXnVbrs8BOT3228LWKOyWLsIekrNu0AumIWOcBYzeF6MUUmO2mL8qIcBwXS1DNA9o3Gs1OXQ00vieij561'
