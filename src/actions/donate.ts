'use server'

import { headers } from 'next/headers'
import {
  getStripe,
  getStripeConfigErrors,
  getDonationTier,
  resolveDonationTier,
  stripeErrorMessage,
  type DonationTierId,
} from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'
import { donationSchema } from '@/lib/validations'
import { getSiteUrl } from '@/lib/site-url'

const MAX_BAGS = 1000

function tierIdFromPriceId(priceId: string): DonationTierId | undefined {
  const tier = getDonationTier(priceId)
  if (tier) return tier.id

  for (const id of ['CONTRIBUTE_10', 'CONTRIBUTE_25', 'FAMILY_BAG'] as const) {
    const monthly = resolveDonationTier(id, 'monthly')
    const oneTime = resolveDonationTier(id, 'one_time')
    if (monthly?.priceId === priceId || oneTime?.priceId === priceId) {
      return id
    }
  }
  return undefined
}

export async function createCheckoutSession(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const configErrors = getStripeConfigErrors()
  if (configErrors.length > 0) {
    console.error('Stripe config errors:', configErrors)
    return {
      error:
        'Payments are not configured yet. The site owner needs to add Stripe environment variables.',
    }
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  const { success: rateLimitOk } = await rateLimit(`donate:${ip}`)
  if (!rateLimitOk) {
    return { error: 'Too many requests. Please try again in a minute.' }
  }

  const raw = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    message: (formData.get('message') as string) || undefined,
    priceId: formData.get('priceId'),
    givingFrequency: (formData.get('givingFrequency') as string) || 'one_time',
  }

  const result = donationSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { firstName, lastName, email, message, priceId, givingFrequency } =
    result.data

  const tierId = tierIdFromPriceId(priceId)
  const isMonthly = givingFrequency === 'monthly'

  if (isMonthly && tierId === 'CONTRIBUTE_10') {
    return {
      error: 'The $10 option is available for one-time gifts only. Choose one-time or pick another amount.',
    }
  }

  const tier = tierId
    ? resolveDonationTier(tierId, givingFrequency)
    : getDonationTier(priceId)

  if (!tier || tier.priceId !== priceId) {
    return {
      error:
        'Invalid product selected. Check Stripe price IDs are set correctly in your environment.',
    }
  }

  const quantityRaw = parseInt((formData.get('quantity') as string) ?? '1', 10)
  const quantity =
    tier.donationType === 'full_bag'
      ? isNaN(quantityRaw) || quantityRaw < 1
        ? 1
        : Math.min(quantityRaw, MAX_BAGS)
      : 1

  const bags = tier.bags * quantity
  const siteUrl = getSiteUrl()

  const metadata = {
    first_name: firstName,
    last_name: lastName,
    email,
    message: message ?? '',
    bags: bags.toString(),
    donation_type: tier.donationType,
    giving_frequency: givingFrequency,
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: isMonthly ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity }],
      allow_promotion_codes:
        !isMonthly && tier.donationType === 'full_bag',
      customer_email: email,
      metadata,
      ...(isMonthly
        ? {
            subscription_data: {
              metadata,
            },
          }
        : {}),
      success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/sponsor`,
    })

    if (!session.url) {
      return { error: 'Stripe did not return a checkout URL. Please try again.' }
    }

    return { url: session.url }
  } catch (err) {
    console.error('Stripe error:', err)
    const message = stripeErrorMessage(err)
    return {
      error: `Payment could not be started: ${message}`,
    }
  }
}
