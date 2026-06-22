'use client'

import { useState, useTransition } from 'react'
import { ShoppingBag, Minus, Plus, Loader2, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCheckoutSession } from '@/actions/donate'

const BAG_PRICE = 50
const MAX_BAGS = 1000

const BAG_CONTENTS = [
  'Fresh protein (chicken, seasonal affordable cuts, or canned alternatives)',
  'Pantry staples (rice, pasta, bread)',
  'Fresh fruit and vegetables',
  'Basic meal essentials (milk, sauce, legumes)',
]

const MILESTONES = [5, 10]

function ProgressDial({ quantity }: { quantity: number }) {
  const activeMilestone = quantity <= 5 ? 5 : 10
  const progress = Math.min(quantity / activeMilestone, 1)
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative h-36 w-36">
        <svg
          width="144"
          height="144"
          viewBox="0 0 144 144"
          className="-rotate-90"
        >
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="#2a3d2e"
            strokeWidth="12"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="#4ade80"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.35s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{quantity}</span>
          <span className="text-xs text-white/60">
            {quantity === 1 ? 'household' : 'households'}
          </span>
        </div>
      </div>

      {/* Milestones */}
      <div className="flex gap-8 text-sm">
        {MILESTONES.map((m) => (
          <div
            key={m}
            className={`flex items-center gap-1.5 transition-colors ${
              quantity >= m ? 'text-green-400' : 'text-white/40'
            }`}
          >
            {quantity >= m ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <span className="h-3.5 w-3.5 rounded-full border border-current" />
            )}
            {m} families
          </div>
        ))}
      </div>
    </div>
  )
}

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
      <div className="rounded-lg border border-green-400/20 bg-green-400/5 p-5">
        <h2 className="mb-3 font-semibold text-white">
          What&apos;s in each bag
        </h2>
        <p className="mb-3 text-sm text-white/60">
          A carefully selected mix of essential foods to support a small
          household for several days.
        </p>
        <ul className="space-y-2">
          {BAG_CONTENTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Progress dial + quantity picker */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          How many bags of groceries?
        </h2>

        <ProgressDial quantity={quantity} />

        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Remove one bag"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="min-w-[80px] text-center">
            <p className="text-sm text-white/60">
              {quantity} × $50 = <span className="text-xl font-bold text-green-400">${total}.00</span>
            </p>
          </div>

          <button
            type="button"
            onClick={increment}
            disabled={quantity >= MAX_BAGS}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add one bag"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Donor details */}
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="priceId" value={priceFamilyBagId} />
        <input type="hidden" name="quantity" value={quantity} />

        <h2 className="text-lg font-semibold text-white">Your details</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white/80">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Jane"
              required
              autoComplete="given-name"
              className="border-white/20 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white/80">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Smith"
              required
              autoComplete="family-name"
              className="border-white/20 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            required
            autoComplete="email"
            className="border-white/20 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-white/80">
            Message{' '}
            <span className="font-normal text-white/40">(optional)</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Leave a supportive message to your impacted family"
            rows={3}
            maxLength={500}
            className="border-white/20 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full bg-green-500 text-white hover:bg-green-600"
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
              Buy {quantity} {quantity === 1 ? 'Bag' : 'Bags'} of Groceries (${total}.00)
            </>
          )}
        </Button>

        <p className="text-center text-xs text-white/40">
          Payments processed securely via Stripe.
        </p>
      </form>

      {/* Business sponsor */}
      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-sm text-white/50">
          Representing a business?{' '}
          <a
            href="/contact"
            className="font-medium text-green-400 underline underline-offset-2 hover:text-green-300"
          >
            Get in touch about a bulk order
          </a>
        </p>
      </div>
    </div>
  )
}
