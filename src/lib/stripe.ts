import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  if (!_stripe) {
    _stripe = new Stripe(secretKey)
  }
  return _stripe
}

export function getFamilyBagPriceId(): string | undefined {
  return process.env.STRIPE_PRICE_FAMILY_BAG
}

export function getStripeProducts() {
  return {
    FAMILY_BAG: {
      priceId: process.env.STRIPE_PRICE_FAMILY_BAG ?? '',
      label: 'Buy a Bag of Groceries for a Family',
      description: 'A full grocery bag for a Tasmanian family, $50.',
      amount: 5000,
      bags: 1,
    },
  } as const
}

/** @deprecated use getStripeProducts() */
export const STRIPE_PRODUCTS = getStripeProducts()

export function getStripeConfigErrors(): string[] {
  const errors: string[] = []

  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY is missing')
  } else if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    errors.push('STRIPE_SECRET_KEY must start with sk_test_ or sk_live_')
  }

  if (!process.env.STRIPE_PRICE_FAMILY_BAG) {
    errors.push('STRIPE_PRICE_FAMILY_BAG is missing')
  } else if (!process.env.STRIPE_PRICE_FAMILY_BAG.startsWith('price_')) {
    errors.push('STRIPE_PRICE_FAMILY_BAG must start with price_')
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    errors.push('NEXT_PUBLIC_SITE_URL is missing')
  }

  return errors
}

export function stripeErrorMessage(err: unknown): string {
  if (err instanceof Stripe.errors.StripeError) {
    switch (err.code) {
      case 'resource_missing':
        return 'The Stripe price ID is invalid or does not exist. Check STRIPE_PRICE_FAMILY_BAG matches your Stripe dashboard and test/live mode.'
      case 'api_key_expired':
      case 'invalid_api_key':
        return 'The Stripe secret key is invalid. Check STRIPE_SECRET_KEY in your environment variables.'
      default:
        return err.message
    }
  }

  if (err instanceof Error) {
    return err.message
  }

  return 'Unknown payment error'
}
