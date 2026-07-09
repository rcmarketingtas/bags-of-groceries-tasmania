'use client'

import { useState, useTransition } from 'react'
import { Loader2, AlertCircle, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { startShopifyCheckout } from '@/actions/shopify-checkout'

const MAX_QUANTITY = 20

interface CaramelSliceBuyProps {
  variantId: string
  availableForSale: boolean
  formattedPrice: string
}

export function CaramelSliceBuy({
  variantId,
  availableForSale,
  formattedPrice,
}: CaramelSliceBuyProps) {
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleBuy() {
    setError(null)
    const formData = new FormData()
    formData.set('variantId', variantId)
    formData.set('quantity', String(quantity))

    startTransition(async () => {
      const result = await startShopifyCheckout(formData)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.url) {
        window.location.href = result.url
      }
    })
  }

  if (!availableForSale) {
    return (
      <div className="rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-4 text-center text-sm text-[#1c4d31]/80">
        Sold out for this batch. Check back soon or contact us.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-4">
        <div>
          <p className="text-sm font-medium text-black">Quantity</p>
          <p className="text-xs text-[#1c4d31]/60">{formattedPrice} each</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5E0DA] bg-white text-[#1c4d31] transition-colors hover:bg-[#F4F7F5]"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-semibold text-black">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5E0DA] bg-white text-[#1c4d31] transition-colors hover:bg-[#F4F7F5]"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className="btn-glow w-full bg-[#1c4d31] text-white hover:bg-[#163d27]"
        disabled={isPending}
        onClick={handleBuy}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Going to checkout...
          </>
        ) : (
          `Buy Now — ${formattedPrice}`
        )}
      </Button>

      <p className="text-center text-xs text-[#1c4d31]/60">
        Secure checkout powered by Shopify. Local delivery in Launceston and nearby suburbs.
      </p>
    </div>
  )
}
