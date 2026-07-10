import { getSiteUrl } from '@/lib/site-url'
import {
  getShopProductHandle,
  getShopifyConfigErrors,
  getShopifyStoreDomain,
  getShopifyStorefrontToken,
  isShopifyConfigured,
} from '@/lib/shop-config'

const STOREFRONT_API_VERSION = '2024-10'

export type ShopifyProduct = {
  title: string
  description: string
  featuredImage: { url: string; altText: string | null } | null
  variantId: string
  variantTitle: string
  priceAmount: string
  currencyCode: string
  availableForSale: boolean
}

export type ShopifyProductResult =
  | { ok: true; product: ShopifyProduct }
  | { ok: false; error: string }

type StorefrontResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const domain = getShopifyStoreDomain()
  const token = getShopifyStorefrontToken()

  const response = await fetch(
    `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    },
  )

  const body = await response.text()

  if (!response.ok) {
    throw new Error(
      `Shopify HTTP ${response.status}: ${body.slice(0, 200) || response.statusText}`,
    )
  }

  let json: StorefrontResponse<T>
  try {
    json = JSON.parse(body) as StorefrontResponse<T>
  } catch {
    throw new Error('Shopify returned invalid JSON')
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  if (!json.data) {
    throw new Error('Shopify API returned no data')
  }

  return json.data
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      title
      description
      featuredImage {
        url
        altText
      }
      variants(first: 1) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

type ProductByHandleData = {
  product: {
    title: string
    description: string
    featuredImage: { url: string; altText: string | null } | null
    variants: {
      edges: Array<{
        node: {
          id: string
          title: string
          availableForSale: boolean
          price: { amount: string; currencyCode: string }
        } | null
      }>
    }
  } | null
}

export async function fetchCaramelSliceProduct(): Promise<ShopifyProductResult> {
  if (!isShopifyConfigured()) {
    return { ok: false, error: getShopifyConfigErrors().join(', ') }
  }

  try {
    const handle = getShopProductHandle()
    const data = await storefrontFetch<ProductByHandleData>(PRODUCT_BY_HANDLE_QUERY, {
      handle,
    })

    const product = data.product
    if (!product) {
      return {
        ok: false,
        error: `No product found for handle "${handle}". Publish it to your Headless sales channel in Shopify.`,
      }
    }

    const variant = product.variants.edges[0]?.node
    if (!variant) {
      return { ok: false, error: 'Product has no variants.' }
    }

    return {
      ok: true,
      product: {
        title: product.title,
        description: product.description,
        featuredImage: product.featuredImage,
        variantId: variant.id,
        variantTitle: variant.title,
        priceAmount: variant.price.amount,
        currencyCode: variant.price.currencyCode,
        availableForSale: variant.availableForSale,
      },
    }
  } catch (err) {
    let message = err instanceof Error ? err.message : 'Unknown Shopify error'
    if (message.includes('401') || message.includes('UNAUTHORIZED')) {
      message +=
        ' — Regenerate the Storefront API access token in Shopify Headless (not the Admin API token). Ensure SHOPIFY_STORE_DOMAIN matches that same store.'
    }
    console.error('[shopify] product fetch failed:', message)
    return { ok: false, error: message }
  }
}

/** @deprecated use fetchCaramelSliceProduct */
export async function getCaramelSliceProduct(): Promise<ShopifyProduct | null> {
  const result = await fetchCaramelSliceProduct()
  return result.ok ? result.product : null
}

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`

type CartCreateData = {
  cartCreate: {
    cart: { checkoutUrl: string } | null
    userErrors: Array<{ field: string[] | null; message: string }>
  }
}

export async function createShopifyCheckout(
  variantId: string,
  quantity: number,
): Promise<{ checkoutUrl: string }> {
  if (!isShopifyConfigured()) {
    throw new Error(`Shopify is not configured: ${getShopifyConfigErrors().join(', ')}`)
  }

  const data = await storefrontFetch<CartCreateData>(CART_CREATE_MUTATION, {
    lines: [{ merchandiseId: variantId, quantity }],
  })

  const { cart, userErrors } = data.cartCreate

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join('; '))
  }

  if (!cart?.checkoutUrl) {
    throw new Error('Shopify did not return a checkout URL')
  }

  const siteUrl = getSiteUrl()
  const returnUrl = `${siteUrl}/thank-you?source=shopify`
  const separator = cart.checkoutUrl.includes('?') ? '&' : '?'
  const checkoutUrl = `${cart.checkoutUrl}${separator}return_url=${encodeURIComponent(returnUrl)}`

  return { checkoutUrl }
}

export function formatShopifyPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount)
  if (currencyCode === 'AUD') {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value)
  }
  return `${currencyCode} ${value.toFixed(2)}`
}

export function getShopifyImageHostname(url: string): string | null {
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}
