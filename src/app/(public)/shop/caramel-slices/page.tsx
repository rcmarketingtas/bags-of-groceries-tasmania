import type { Metadata } from 'next'
import { Cake, Heart, Truck } from 'lucide-react'
import { CaramelSliceBuy } from '@/components/shop/caramel-slice-buy'
import {
  getShopifyConfigErrors,
  isShopifyConfigured,
  SHOPIFY_ENV_NAMES,
} from '@/lib/shop-config'
import {
  formatShopifyPrice,
  fetchCaramelSliceProduct,
} from '@/lib/shopify'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Order Caramel Slice',
    description:
      'Order homemade caramel slices — 100% of profits support Bags of Groceries Tasmania.',
  }
}

export const dynamic = 'force-dynamic'

export default async function CaramelSlicesPage() {
  const configErrors = getShopifyConfigErrors()
  const productResult = isShopifyConfigured()
    ? await fetchCaramelSliceProduct()
    : null
  const product = productResult?.ok ? productResult.product : null
  const productError =
    productResult && !productResult.ok ? productResult.error : null

  return (
    <div className="min-h-screen">
      <section className="section-sage py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <Cake className="h-6 w-6 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Order a Caramel Slice
          </h1>
          <p className="text-lg text-[#A3C2B2]">
            100% of profits support Bags of Groceries Tasmania — putting food on
            the table for Tasmanian families.
          </p>
        </div>
      </section>

      <section className="section-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {configErrors.length > 0 && (
            <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-medium">Shop preview — configuration needed</p>
              <p className="mt-1 text-amber-800">
                Add these in <strong>Vercel → Settings → Environment Variables</strong>{' '}
                (enable <strong>Preview</strong> and <strong>Production</strong>), then{' '}
                <strong>Redeploy</strong>. For local dev, use <code className="text-xs">.env.local</code>.
              </p>
              <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
                {SHOPIFY_ENV_NAMES.map((name) => (
                  <li key={name}>
                    <code>{name}</code>
                    {configErrors.some((e) => e.startsWith(name)) ? ' — missing' : ' — ok'}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-amber-800">
                Check status: <code>/api/health/shop</code>
              </p>
            </div>
          )}

          {productError && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-medium">Could not load product from Shopify</p>
              <p className="mt-1 text-xs">{productError}</p>
              <p className="mt-2 text-xs">
                <strong>401 UNAUTHORIZED?</strong> Use the <strong>Storefront API</strong> token from
                Shopify → Headless — not the Admin API token. Domain must be{' '}
                <code>your-store.myshopify.com</code>.
              </p>
            </div>
          )}

          {!product && !productError && configErrors.length === 0 && (
            <div className="card-light py-16 text-center text-[#1c4d31]/80">
              Product not found. Check <code>SHOPIFY_PRODUCT_HANDLE</code> matches
              your Shopify product slug.
            </div>
          )}

          {product && (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#D5E0DA] bg-[#F4F7F5]">
                {product.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText ?? product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Cake className="h-24 w-24 text-[#1c4d31]/20" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <h2 className="mb-2 text-2xl font-bold text-black sm:text-3xl">
                  {product.title}
                </h2>
                <p className="mb-6 text-3xl font-bold text-[#1c4d31]">
                  {formatShopifyPrice(product.priceAmount, product.currencyCode)}
                </p>

                {product.description && (
                  <p className="mb-6 whitespace-pre-wrap text-[#1c4d31]/80">
                    {product.description}
                  </p>
                )}

                <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-3 text-sm text-[#1c4d31]/80">
                    <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#1c4d31]" />
                    <span>Every dollar of profit funds grocery bags for families in need.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#1c4d31]/80">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#1c4d31]" />
                    <span>Local delivery in Launceston and nearby suburbs. Shipping calculated at checkout.</span>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-4 text-xs text-[#1c4d31]/70">
                  <p className="font-medium text-[#1c4d31]">Allergen information</p>
                  <p className="mt-1">
                    Contains gluten and dairy. Made in a home kitchen. Please contact
                    us if you have allergy concerns before ordering.
                  </p>
                </div>

                <CaramelSliceBuy
                  variantId={product.variantId}
                  availableForSale={product.availableForSale}
                  formattedPrice={formatShopifyPrice(
                    product.priceAmount,
                    product.currencyCode,
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
