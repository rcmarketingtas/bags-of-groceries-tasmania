'use server'

import { headers } from 'next/headers'
import { createShopifyCheckout } from '@/lib/shopify'
import { getShopifyConfigErrors } from '@/lib/shop-config'
import { rateLimit } from '@/lib/rate-limit'

const MAX_QUANTITY = 20

export async function startShopifyCheckout(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const configErrors = getShopifyConfigErrors()
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

  const variantId = (formData.get('variantId') as string)?.trim()
  const quantityRaw = parseInt((formData.get('quantity') as string) ?? '1', 10)
  const quantity =
    isNaN(quantityRaw) || quantityRaw < 1
      ? 1
      : Math.min(quantityRaw, MAX_QUANTITY)

  if (!variantId) {
    return { error: 'Product variant is missing. Refresh the page and try again.' }
  }

  try {
    const { checkoutUrl } = await createShopifyCheckout(variantId, quantity)
    return { url: checkoutUrl }
  } catch (err) {
    console.error('Shopify checkout error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `Checkout could not be started: ${message}` }
  }
}
