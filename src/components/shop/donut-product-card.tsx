import { Cake, Heart, Truck } from 'lucide-react'
import { DonutBuy } from '@/components/shop/donut-buy'
import { formatShopifyPrice, type ShopifyProduct } from '@/lib/shopify'

type Props = {
  label: string
  product: ShopifyProduct | null
  error: string | null
}

export function DonutProductCard({ label, product, error }: Props) {
  return (
    <div className="rounded-2xl border border-[#D5E0DA] bg-white p-5 shadow-sm">
      <div className="relative mb-5 aspect-square overflow-hidden rounded-xl border border-[#D5E0DA] bg-[#F4F7F5]">
        {product?.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Cake className="h-20 w-20 text-[#1c4d31]/20" />
          </div>
        )}
      </div>

      <h2 className="mb-1 text-xl font-bold text-black sm:text-2xl">
        {product?.title ?? label}
      </h2>

      {product && (
        <p className="mb-4 text-2xl font-bold text-[#1c4d31]">
          {formatShopifyPrice(product.priceAmount, product.currencyCode)}
        </p>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          <p className="font-medium">Could not load this box from Shopify</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {!product && !error && (
        <div className="mb-4 rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-3 text-xs text-[#1c4d31]/70">
          Set up this product handle to make it available for purchase.
        </div>
      )}

      {product?.description && (
        <p className="mb-4 whitespace-pre-wrap text-sm text-[#1c4d31]/80">
          {product.description}
        </p>
      )}

      <div className="mb-4 space-y-2">
        <div className="flex items-start gap-3 text-xs text-[#1c4d31]/80">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#1c4d31]" />
          <span>Every dollar of profit funds grocery bags for families in need.</span>
        </div>
        <div className="flex items-start gap-3 text-xs text-[#1c4d31]/80">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#1c4d31]" />
          <span>
            Local delivery in Launceston and nearby suburbs, within 7 days of
            ordering.
          </span>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-3 text-xs text-[#1c4d31]/70">
        <p className="font-medium text-[#1c4d31]">Allergen Information</p>
        <p className="mt-1">
          Contains or may contain: wheat (gluten), milk, eggs, soy, peanuts,
          and tree nuts.
        </p>
      </div>

      {product && (
        <DonutBuy
          variantId={product.variantId}
          availableForSale={product.availableForSale}
          formattedPrice={formatShopifyPrice(
            product.priceAmount,
            product.currencyCode,
          )}
        />
      )}
    </div>
  )
}
