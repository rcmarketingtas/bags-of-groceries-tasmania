/** Shop is live unless explicitly disabled with NEXT_PUBLIC_SHOP_ENABLED=false */
export function isShopEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SHOP_ENABLED !== 'false'
}

function normalizeEnvValue(raw: string | undefined): string {
  return (raw ?? '').trim().replace(/^['"]|['"]$/g, '')
}

export type ShopProductId = 'BOX_OF_6_ASSORTED' | 'BOX_OF_6_VANILLA_GLAZE'

type ShopProductConfig = {
  id: ShopProductId
  /** Fallback label shown until the live Shopify title loads. */
  label: string
  envVarName: string
}

/** The donut boxes sold on /shop/donuts. Add more here to sell additional boxes. */
export const SHOP_PRODUCTS: ShopProductConfig[] = [
  {
    id: 'BOX_OF_6_ASSORTED',
    label: 'Box of 6 Assorted Donuts',
    envVarName: 'SHOPIFY_PRODUCT_HANDLE_BOX_OF_6_ASSORTED',
  },
  {
    id: 'BOX_OF_6_VANILLA_GLAZE',
    label: 'Box of 6 Vanilla Glaze Donuts',
    envVarName: 'SHOPIFY_PRODUCT_HANDLE_BOX_OF_6_VANILLA_GLAZE',
  },
]

export function getShopProductHandle(id: ShopProductId): string {
  const config = SHOP_PRODUCTS.find((p) => p.id === id)
  if (!config) return ''
  return normalizeEnvValue(process.env[config.envVarName])
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

/** Domain + token only — enough to talk to Shopify, independent of which products are set up. */
export function getShopifyCoreConfigErrors(): string[] {
  const errors: string[] = []

  if (!getShopifyStoreDomain()) {
    errors.push('SHOPIFY_STORE_DOMAIN is missing')
  }
  if (!getShopifyStorefrontToken()) {
    errors.push('SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing')
  }

  return errors
}

export function isShopifyCoreConfigured(): boolean {
  return getShopifyCoreConfigErrors().length === 0
}

/** Core errors plus any missing product handles — used for the full "everything is set up" banner. */
export function getShopifyConfigErrors(): string[] {
  const errors = getShopifyCoreConfigErrors()

  for (const product of SHOP_PRODUCTS) {
    if (!getShopProductHandle(product.id)) {
      errors.push(`${product.envVarName} is missing`)
    }
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
  ...SHOP_PRODUCTS.map((p) => p.envVarName),
] as const
