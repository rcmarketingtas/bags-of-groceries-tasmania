/** Shop is live unless explicitly disabled with NEXT_PUBLIC_SHOP_ENABLED=false */
export function isShopEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SHOP_ENABLED !== 'false'
}

function normalizeEnvValue(raw: string | undefined): string {
  return (raw ?? '').trim().replace(/^['"]|['"]$/g, '')
}

export function getShopProductHandle(): string {
  return (
    normalizeEnvValue(process.env.SHOPIFY_PRODUCT_HANDLE) ||
    normalizeEnvValue(process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE)
  )
}

export function getShopifyStoreDomain(): string {
  const raw =
    normalizeEnvValue(process.env.SHOPIFY_STORE_DOMAIN) ||
    normalizeEnvValue(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)
  return raw.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function getShopifyStorefrontToken(): string {
  return (
    normalizeEnvValue(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) ||
    normalizeEnvValue(process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN)
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
