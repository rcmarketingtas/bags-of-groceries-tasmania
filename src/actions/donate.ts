'use server'

import { headers } from 'next/headers'
import {
  getStripe,
  getStripeConfigErrors,
  getStripeProducts,
  stripeErrorMessage,
} from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'
import { donationSchema } from '@/lib/validations'

const MAX_BAGS = 1000

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
  }

  const result = donationSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { firstName, lastName, email, message, priceId } = result.data

  const validPriceIds = Object.values(getStripeProducts())
    .map((p) => p.priceId)
    .filter(Boolean)

  if (!validPriceIds.includes(priceId)) {
    return {
      error:
        'Invalid product selected. Check STRIPE_PRICE_FAMILY_BAG is set correctly in your environment.',
    }
  }

  const quantityRaw = parseInt((formData.get('quantity') as string) ?? '1', 10)
  const quantity =
    isNaN(quantityRaw) || quantityRaw < 1 ? 1 : Math.min(quantityRaw, MAX_BAGS)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, '')

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity }],
      allow_promotion_codes: true,
      customer_email: email,
      metadata: {
        first_name: firstName,
        last_name: lastName,
        email,
        message: message ?? '',
        bags: quantity.toString(),
      },
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
