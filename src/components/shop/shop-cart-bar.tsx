'use client'

import { useState, useTransition } from 'react'
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/shop/cart-context'
import { startShopifyCheckout } from '@/actions/shopify-checkout'
import { formatShopifyPrice } from '@/lib/shopify'

export function ShopCartBar() {
  const { items, updateQuantity, removeItem, totalQuantity } = useCart()
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (items.length === 0) {
    return null
  }

  const currencyCode = items[0]?.currencyCode ?? 'AUD'
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.unitPriceAmount) * item.quantity,
    0,
  )

  function handleCheckout() {
    setError(null)
    startTransition(async () => {
      const result = await startShopifyCheckout(
        items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
      )
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.url) {
        window.location.href = result.url
      }
    })
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D5E0DA] bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {expanded && (
          <div className="max-h-[45vh] overflow-y-auto border-b border-[#D5E0DA] py-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black">{item.title}</p>
                    <p className="text-xs text-[#1c4d31]/60">
                      {formatShopifyPrice(item.unitPriceAmount, item.currencyCode)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D5E0DA] text-[#1c4d31] transition-colors hover:bg-[#F4F7F5]"
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-black">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D5E0DA] text-[#1c4d31] transition-colors hover:bg-[#F4F7F5]"
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="text-[#1c4d31]/40 transition-colors hover:text-red-600"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-[#1c4d31]"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} ·{' '}
              {formatShopifyPrice(String(subtotal), currencyCode)}
            </span>
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          <Button
            type="button"
            size="lg"
            className="btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]"
            disabled={isPending}
            onClick={handleCheckout}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Going to checkout...
              </>
            ) : (
              'Checkout'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
