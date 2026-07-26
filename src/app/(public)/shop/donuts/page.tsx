import type { Metadata } from 'next'
import { Cake } from 'lucide-react'
import { DonutProductCard } from '@/components/shop/donut-product-card'
import {
  SHOP_PRODUCTS,
  getShopProductHandle,
  getShopifyConfigErrors,
  isShopifyCoreConfigured,
  SHOPIFY_ENV_NAMES,
} from '@/lib/shop-config'
import { fetchShopProduct, type ShopifyProduct } from '@/lib/shopify'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Order Donuts',
    description:
      'Order fresh donuts — 100% of profits support Bags of Groceries Tasmania.',
  }
}

export const dynamic = 'force-dynamic'

export default async function DonutsPage() {
  const configErrors = getShopifyConfigErrors()
  const coreConfigured = isShopifyCoreConfigured()

  const products = await Promise.all(
    SHOP_PRODUCTS.map(async (config) => {
      const handle = getShopProductHandle(config.id)
      if (!coreConfigured || !handle) {
        return { config, product: null as ShopifyProduct | null, error: null as string | null }
      }
      const result = await fetchShopProduct(handle)
      return {
        config,
        product: result.ok ? result.product : null,
        error: result.ok ? null : result.error,
      }
    }),
  )

  return (
    <div className="min-h-screen">
      <section className="section-sage py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <Cake className="h-6 w-6 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Order Donuts
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

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {products.map(({ config, product, error }) => (
              <DonutProductCard
                key={config.id}
                label={config.label}
                product={product}
                error={error}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
