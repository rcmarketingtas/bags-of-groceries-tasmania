import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const STRIPE_PRODUCTS = {
  ONE_BAG: {
    priceId: process.env.STRIPE_PRICE_1_BAG!,
    label: 'Sponsor 1 Grocery Bag',
    description: 'Provide one full grocery bag to a Tasmanian family in need.',
    amount: 2500,
    bags: 1,
  },
  TWO_BAGS: {
    priceId: process.env.STRIPE_PRICE_2_BAGS!,
    label: 'Sponsor 2 Grocery Bags',
    description: 'Double your impact — provide two bags to families in need.',
    amount: 5000,
    bags: 2,
  },
} as const
