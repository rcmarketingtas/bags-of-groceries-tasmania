'use client'

import { useState } from 'react'
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/shop/cart-context'

const MAX_QUANTITY = 20
const ADDED_FEEDBACK_MS = 1500

interface DonutBuyProps {
  variantId: string
  title: string
  availableForSale: boolean
  formattedPrice: string
  unitPriceAmount: string
  currencyCode: string
  imageUrl?: string | null
}

export function DonutBuy({
  variantId,
  title,
  availableForSale,
  formattedPrice,
  unitPriceAmount,
  currencyCode,
  imageUrl,
}: DonutBuyProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  function handleAddToCart() {
    addItem({ variantId, title, unitPriceAmount, currencyCode, imageUrl }, quantity)
    setQuantity(1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS)
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

      <Button
        type="button"
        size="lg"
        className="btn-glow w-full bg-[#1c4d31] text-white hover:bg-[#163d27]"
        onClick={handleAddToCart}
      >
        {justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart — {formattedPrice}
          </>
        )}
      </Button>
    </div>
  )
}
