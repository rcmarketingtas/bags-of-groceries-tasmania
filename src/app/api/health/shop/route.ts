import { NextResponse } from 'next/server'
import {
  getShopProductHandle,
  getShopifyConfigErrors,
  getShopifyStoreDomain,
  getShopifyStorefrontToken,
  isShopifyConfigured,
} from '@/lib/shop-config'
import { fetchCaramelSliceProduct } from '@/lib/shopify'

/** Debug Shopify env + live product fetch (never exposes secrets). */
export async function GET() {
  const productResult = isShopifyConfigured()
    ? await fetchCaramelSliceProduct()
    : null

  return NextResponse.json({
    configured: isShopifyConfigured(),
    missing: getShopifyConfigErrors(),
    present: {
      storeDomain: Boolean(getShopifyStoreDomain()),
      storefrontToken: Boolean(getShopifyStorefrontToken()),
      productHandle: Boolean(getShopProductHandle()),
    },
    product: productResult
      ? productResult.ok
        ? {
            ok: true,
            title: productResult.product.title,
            price: productResult.product.priceAmount,
            currency: productResult.product.currencyCode,
          }
        : { ok: false, error: productResult.error }
      : null,
    hint: 'After adding env vars in Vercel, redeploy production.',
  })
}
