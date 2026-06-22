'use client'

import { useState, useTransition } from 'react'
import { ShoppingBag, Minus, Plus, Loader2, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCheckoutSession } from '@/actions/donate'

const BAG_PRICE = 50
const MAX_BAGS = 10

const BAG_CONTENTS = [
  'Fresh protein (chicken, seasonal affordable cuts, or canned alternatives)',
  'Pantry staples (rice, pasta, bread)',
  'Fresh fruit and vegetables',
  'Basic meal essentials (milk, sauce, legumes)',
]

interface DonationFormProps {
  priceFamilyBagId: string
}

export function DonationForm({ priceFamilyBagId }: DonationFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  const total = quantity * BAG_PRICE

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1))
  }

  function increment() {
    setQuantity((q) => Math.min(MAX_BAGS, q + 1))
  }

  async function handleSubmit(formData: FormData) {
    setError(undefined)
    formData.set('priceId', priceFamilyBagId)
    formData.set('quantity', quantity.toString())

    startTransition(async () => {
      const result = await createCheckoutSession(formData)
      if (result.error) {
        setError(result.error)
      } else if (result.url) {
        window.location.href = result.url
      }
    })
  }

  return (
    <div className="space-y-8">

      {/* What's in the bag */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
        <h2 className="mb-3 font-semibold text-gray-900">
          What&apos;s in each bag
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Your purchase provides a carefully selected mix of essential foods
          designed to support a small household for several days.
        </p>
        <ul className="space-y-2">
          {BAG_CONTENTS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Quantity picker */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          How many bags?
        </h2>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-gray-700 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Remove one bag"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="text-center">
            <span className="text-3xl font-bold text-gray-900">{quantity}</span>
            <p className="text-xs text-muted-foreground">
              {quantity === 1 ? 'bag' : 'bags'}
            </p>
          </div>

          <button
            type="button"
            onClick={increment}
            disabled={quantity >= MAX_BAGS}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-gray-700 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add one bag"
          >
            <Plus className="h-4 w-4" />
          </button>

          <div className="ml-4 border-l pl-4">
            <p className="text-sm text-muted-foreground">
              {quantity} × $50
            </p>
            <p className="text-2xl font-bold text-primary">
              ${total}.00
            </p>
          </div>
        </div>
      </div>

      {/* Donor details */}
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="priceId" value={priceFamilyBagId} />
        <input type="hidden" name="quantity" value={quantity} />

        <h2 className="text-lg font-semibold text-gray-900">
          Your details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Jane"
              required
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Smith"
              required
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">
            Message{' '}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Leave an encouraging message..."
            rows={3}
            maxLength={500}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to payment...
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Buy {quantity} {quantity === 1 ? 'Bag' : 'Bags'} of Groceries — ${total}.00
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Payments processed securely via Stripe.
        </p>
      </form>
    </div>
  )
}
