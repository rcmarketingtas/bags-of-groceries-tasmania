import { getSiteUrl } from '@/lib/site-url'
import {
  getShopProductHandle,
  getShopifyConfigErrors,
  getShopifyStoreDomain,
  getShopifyStorefrontToken,
  isShopifyConfigured,
} from '@/lib/shop-config'

const STOREFRONT_API_VERSION = '2025-01'

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
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const json = (await response.json()) as StorefrontResponse<T>

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
        nodes {
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
`

type ProductByHandleData = {
  product: {
    title: string
    description: string
    featuredImage: { url: string; altText: string | null } | null
    variants: {
      nodes: Array<{
        id: string
        title: string
        availableForSale: boolean
        price: { amount: string; currencyCode: string }
      }>
    }
  } | null
}

export async function getCaramelSliceProduct(): Promise<ShopifyProduct | null> {
  if (!isShopifyConfigured()) {
    return null
  }

  const handle = getShopProductHandle()
  const data = await storefrontFetch<ProductByHandleData>(PRODUCT_BY_HANDLE_QUERY, {
    handle,
  })

  const product = data.product
  if (!product) {
    return null
  }

  const variant = product.variants.nodes[0]
  if (!variant) {
    return null
  }

  return {
    title: product.title,
    description: product.description,
    featuredImage: product.featuredImage,
    variantId: variant.id,
    variantTitle: variant.title,
    priceAmount: variant.price.amount,
    currencyCode: variant.price.currencyCode,
    availableForSale: variant.availableForSale,
  }
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
