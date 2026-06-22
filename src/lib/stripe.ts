import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return _stripe
}

export const STRIPE_PRODUCTS = {
  FAMILY_BAG: {
    priceId: process.env.STRIPE_PRICE_FAMILY_BAG!,
    label: 'Buy a Bag of Groceries for a Family',
    description: 'A full grocery bag for a Tasmanian family — $50.',
    amount: 5000,
    bags: 1,
  },
} as const
