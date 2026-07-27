'use server'

import { headers } from 'next/headers'
import { createShopifyCheckout, type CheckoutLine } from '@/lib/shopify'
import { getShopifyCoreConfigErrors } from '@/lib/shop-config'
import { rateLimit } from '@/lib/rate-limit'

const MAX_QUANTITY_PER_LINE = 20
const MAX_LINES = 10

export async function startShopifyCheckout(
  lines: CheckoutLine[],
): Promise<{ url?: string; error?: string }> {
  const configErrors = getShopifyCoreConfigErrors()
  if (configErrors.length > 0) {
    return {
      error: `Shop is not configured yet: ${configErrors.join(', ')}`,
    }
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  const { success: rateLimitOk } = await rateLimit(`shop:${ip}`)
  if (!rateLimitOk) {
    return { error: 'Too many requests. Please try again in a minute.' }
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    return { error: 'Your cart is empty.' }
  }
  if (lines.length > MAX_LINES) {
    return { error: 'Too many different items in your cart.' }
  }

  const sanitizedLines = lines
    .map((line) => {
      const variantId = typeof line.variantId === 'string' ? line.variantId.trim() : ''
      const quantityRaw = Number(line.quantity)
      const quantity =
        Number.isFinite(quantityRaw) && quantityRaw >= 1
          ? Math.min(Math.floor(quantityRaw), MAX_QUANTITY_PER_LINE)
          : 1
      return { variantId, quantity }
    })
    .filter((line) => line.variantId.length > 0)

  if (sanitizedLines.length === 0) {
    return { error: 'Your cart is empty.' }
  }

  try {
    const { checkoutUrl } = await createShopifyCheckout(sanitizedLines)
    return { url: checkoutUrl }
  } catch (err) {
    console.error('Shopify checkout error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `Checkout could not be started: ${message}` }
  }
}
