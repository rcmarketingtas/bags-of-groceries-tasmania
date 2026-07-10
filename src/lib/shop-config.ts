/** When false, shop nav links are hidden and the shop page is noindex. */
export function isShopEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SHOP_ENABLED === 'true'
}

export function getShopProductHandle(): string {
  return (
    process.env.SHOPIFY_PRODUCT_HANDLE?.trim() ??
    process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE?.trim() ??
    ''
  )
}

export function getShopifyStoreDomain(): string {
  const raw =
    process.env.SHOPIFY_STORE_DOMAIN?.trim() ??
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim() ??
    ''
  return raw.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function getShopifyStorefrontToken(): string {
  return (
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() ??
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() ??
    ''
  )
}

export function getShopifyConfigErrors(): string[] {
  const errors: string[] = []

  if (!getShopifyStoreDomain()) {
    errors.push('SHOPIFY_STORE_DOMAIN is missing')
  }
  if (!getShopifyStorefrontToken()) {
    errors.push('SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing')
  }
  if (!getShopProductHandle()) {
    errors.push('SHOPIFY_PRODUCT_HANDLE is missing')
  }

  return errors
}

export function isShopifyConfigured(): boolean {
  return getShopifyConfigErrors().length === 0
}

/** Env var names to set in Vercel / .env.local */
export const SHOPIFY_ENV_NAMES = [
  'SHOPIFY_STORE_DOMAIN',
  'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
  'SHOPIFY_PRODUCT_HANDLE',
] as const
