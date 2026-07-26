import { NextResponse } from 'next/server'
import {
  SHOP_PRODUCTS,
  getShopProductHandle,
  getShopifyConfigErrors,
  getShopifyCoreConfigErrors,
  getShopifyStoreDomain,
  getShopifyStorefrontToken,
  isShopifyCoreConfigured,
} from '@/lib/shop-config'
import { fetchShopProduct } from '@/lib/shopify'

/** Debug Shopify env + live product fetch (never exposes secrets). */
export async function GET() {
  const coreConfigured = isShopifyCoreConfigured()

  const products = await Promise.all(
    SHOP_PRODUCTS.map(async (product) => {
      const handle = getShopProductHandle(product.id)
      if (!coreConfigured || !handle) {
        return {
          id: product.id,
          envVarName: product.envVarName,
          handlePresent: Boolean(handle),
          result: null as null | { ok: true; title: string; price: string; currency: string } | { ok: false; error: string },
        }
      }
      const productResult = await fetchShopProduct(handle)
      return {
        id: product.id,
        envVarName: product.envVarName,
        handlePresent: true,
        result: productResult.ok
          ? {
              ok: true as const,
              title: productResult.product.title,
              price: productResult.product.priceAmount,
              currency: productResult.product.currencyCode,
            }
          : { ok: false as const, error: productResult.error },
      }
    }),
  )

  return NextResponse.json({
    configured: getShopifyConfigErrors().length === 0,
    missing: getShopifyConfigErrors(),
    present: {
      storeDomain: Boolean(getShopifyStoreDomain()),
      storefrontToken: Boolean(getShopifyStorefrontToken()),
    },
    coreConfigErrors: getShopifyCoreConfigErrors(),
    products,
    hint: 'After adding env vars in Vercel, redeploy production.',
  })
}
