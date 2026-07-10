import { NextResponse } from 'next/server'
import {
  getShopProductHandle,
  getShopifyConfigErrors,
  getShopifyStoreDomain,
  getShopifyStorefrontToken,
  isShopifyConfigured,
} from '@/lib/shop-config'

/** Debug which Shopify env vars are present (never exposes values). */
export async function GET() {
  return NextResponse.json({
    configured: isShopifyConfigured(),
    missing: getShopifyConfigErrors(),
    present: {
      storeDomain: Boolean(getShopifyStoreDomain()),
      storefrontToken: Boolean(getShopifyStorefrontToken()),
      productHandle: Boolean(getShopProductHandle()),
    },
    hint: 'After adding env vars in Vercel, redeploy the preview deployment.',
  })
}
