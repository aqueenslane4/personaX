import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
    images: 30,
    videos: 2,
    personas: 1,
    features: [
      '30 image generations/mo',
      '2 video clips/mo',
      'Unlimited text & captions',
      '1 AI persona',
      'Bio & hashtag generator',
    ],
  },
  pro: {
    name: 'Pro',
    price: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    images: 100,
    videos: 15,
    personas: 3,
    features: [
      '100 image generations/mo',
      '15 video clips/mo',
      'Unlimited text & captions',
      '3 AI personas',
      'Character consistency lock',
      'Content calendar',
      'Priority generation speed',
    ],
  },
}
