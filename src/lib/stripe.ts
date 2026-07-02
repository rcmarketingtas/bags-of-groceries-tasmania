import Stripe from 'stripe'

let _stripe: Stripe | null = null

export type DonationTierId = 'CONTRIBUTE_25' | 'FAMILY_BAG'

export type DonationTier = {
  id: DonationTierId
  priceId: string
  label: string
  description: string
  amount: number
  bags: number
  donationType: 'contribution' | 'full_bag'
}

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

export function getContribute25PriceId(): string | undefined {
  return process.env.STRIPE_PRICE_CONTRIBUTE_25
}

export function getStripeProducts(): Record<DonationTierId, DonationTier> {
  return {
    CONTRIBUTE_25: {
      id: 'CONTRIBUTE_25',
      priceId: process.env.STRIPE_PRICE_CONTRIBUTE_25 ?? '',
      label: 'Support the program',
      description: 'Contribute $25 to help Bags of Groceries Tasmania.',
      amount: 2500,
      bags: 0,
      donationType: 'contribution',
    },
    FAMILY_BAG: {
      id: 'FAMILY_BAG',
      priceId: process.env.STRIPE_PRICE_FAMILY_BAG ?? '',
      label: 'Full bag for a family',
      description: 'A full grocery bag for a Tasmanian family, $50.',
      amount: 5000,
      bags: 1,
      donationType: 'full_bag',
    },
  }
}

export function getAvailableDonationTiers(): DonationTier[] {
  return Object.values(getStripeProducts()).filter((tier) => Boolean(tier.priceId))
}

export function getDonationTier(priceId: string): DonationTier | undefined {
  return getAvailableDonationTiers().find((tier) => tier.priceId === priceId)
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

  const contribute25 = process.env.STRIPE_PRICE_CONTRIBUTE_25
  if (contribute25 && !contribute25.startsWith('price_')) {
    errors.push('STRIPE_PRICE_CONTRIBUTE_25 must start with price_')
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
        return 'The Stripe price ID is invalid or does not exist. Check your Stripe price IDs match your dashboard and test/live mode.'
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
