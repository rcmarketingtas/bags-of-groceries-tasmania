'use server'

import { headers } from 'next/headers'
import { getStripe, STRIPE_PRODUCTS } from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'
import { donationSchema } from '@/lib/validations'

const VALID_PRICE_IDS = () =>
  Object.values(STRIPE_PRODUCTS).map((p) => p.priceId)

export async function createCheckoutSession(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
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

  if (!VALID_PRICE_IDS().includes(priceId)) {
    return { error: 'Invalid sponsorship package selected.' }
  }

  const product = Object.values(STRIPE_PRODUCTS).find(
    (p) => p.priceId === priceId,
  )!

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: {
        first_name: firstName,
        last_name: lastName,
        email,
        message: message ?? '',
        bags: product.bags.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sponsor`,
    })

    return { url: session.url! }
  } catch (err) {
    console.error('Stripe error:', err)
    return { error: 'Payment could not be started. Please try again.' }
  }
}
