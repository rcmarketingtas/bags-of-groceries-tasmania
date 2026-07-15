'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { ShoppingBag, Minus, Plus, Loader2, AlertCircle, Check, Heart, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCheckoutSession } from '@/actions/donate'
import type { DonationTierId, GivingFrequency } from '@/lib/stripe'

const BAG_PRICE = 50
const CONTRIBUTE_PRICE = 25
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
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          <circle cx="72" cy="72" r={radius} fill="none" stroke="#163d27" strokeWidth="12" />
          <circle
            cx="72" cy="72" r={radius}
            fill="none"
            stroke="#A3C2B2"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.35s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{quantity}</span>
          <span className="text-xs text-[#A3C2B2]">
            {quantity === 1 ? 'household' : 'households'}
          </span>
        </div>
      </div>

      <div className="flex gap-8 text-sm">
        {MILESTONES.map((m) => (
          <div
            key={m}
            className={`flex items-center gap-1.5 transition-colors ${
              quantity >= m ? 'text-[#A3C2B2]' : 'text-white/30'
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
  priceContribute25Id?: string
  priceFamilyBagMonthlyId?: string
  priceContribute25MonthlyId?: string
  monthlyGivingConfigured?: boolean
}

function resolvePriceId(
  tier: DonationTierId,
  frequency: GivingFrequency,
  props: DonationFormProps,
): string {
  if (frequency === 'monthly') {
    if (tier === 'CONTRIBUTE_25' && props.priceContribute25MonthlyId) {
      return props.priceContribute25MonthlyId
    }
    return props.priceFamilyBagMonthlyId ?? props.priceFamilyBagId
  }

  if (tier === 'CONTRIBUTE_25' && props.priceContribute25Id) {
    return props.priceContribute25Id
  }
  return props.priceFamilyBagId
}

export function DonationForm(props: DonationFormProps) {
  const {
    priceFamilyBagId,
    priceContribute25Id,
    monthlyGivingConfigured = false,
  } = props

  const [givingFrequency, setGivingFrequency] = useState<GivingFrequency>(
    monthlyGivingConfigured ? 'monthly' : 'one_time',
  )
  const [selectedTier, setSelectedTier] = useState<DonationTierId>(
    priceContribute25Id ? 'CONTRIBUTE_25' : 'FAMILY_BAG',
  )
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  const isFullBag = selectedTier === 'FAMILY_BAG'
  const isMonthly = givingFrequency === 'monthly'
  const selectedPriceId = resolvePriceId(selectedTier, givingFrequency, props)
  const total = isFullBag ? quantity * BAG_PRICE : CONTRIBUTE_PRICE

  function decrement() { setQuantity((q) => Math.max(1, q - 1)) }
  function increment() { setQuantity((q) => Math.min(MAX_BAGS, q + 1)) }

  async function handleSubmit(formData: FormData) {
    setError(undefined)
    formData.set('priceId', selectedPriceId)
    formData.set('quantity', isFullBag ? quantity.toString() : '1')
    formData.set('givingFrequency', givingFrequency)
    startTransition(async () => {
      const result = await createCheckoutSession(formData)
      if (result.error) setError(result.error)
      else if (result.url) window.location.href = result.url
    })
  }

  const submitLabel = (() => {
    if (isMonthly) {
      if (isFullBag) {
        return `Give ${quantity} ${quantity === 1 ? 'Bag' : 'Bags'} of Groceries ($${total}/month)`
      }
      return `Give $${CONTRIBUTE_PRICE}/month`
    }

    if (isFullBag) {
      return `Give ${quantity} ${quantity === 1 ? 'Bag' : 'Bags'} of Groceries ($${total}.00)`
    }
    return `Give $${CONTRIBUTE_PRICE} to Support the Program`
  })()

  return (
    <div className="space-y-8">
      {/* What's in the bag */}
      <div className="rounded-xl border border-[#163d27] bg-[#163d27]/60 p-5">
        <h2 className="mb-3 font-semibold text-white">What&apos;s in each bag</h2>
        <ul className="space-y-2">
          {BAG_CONTENTS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#A3C2B2]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Frequency selection */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Choose how to give</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => monthlyGivingConfigured && setGivingFrequency('monthly')}
            disabled={!monthlyGivingConfigured}
            className={`rounded-xl border p-4 text-left transition-colors ${
              givingFrequency === 'monthly'
                ? 'border-[#A3C2B2] bg-[#163d27]/80'
                : 'border-[#163d27] bg-[#163d27]/40 hover:bg-[#163d27]/60'
            } ${!monthlyGivingConfigured ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#A3C2B2]" />
              <span className="font-semibold text-white">Give monthly</span>
            </div>
            <p className="text-sm text-[#A3C2B2]">
              Ongoing support for Tasmanian families.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setGivingFrequency('one_time')}
            className={`rounded-xl border p-4 text-left transition-colors ${
              givingFrequency === 'one_time'
                ? 'border-white bg-white/10'
                : 'border-[#163d27] bg-[#163d27]/40 hover:bg-[#163d27]/60'
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-white" />
              <span className="font-semibold text-white">One-time</span>
            </div>
            <p className="text-sm text-[#A3C2B2]">A single gift today.</p>
          </button>
        </div>
        {!monthlyGivingConfigured ? (
          <p className="mt-2 text-xs text-[#A3C2B2]/70">
            Monthly giving will appear once monthly Stripe prices are configured.
          </p>
        ) : null}
      </div>

      {/* Tier selection */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Choose an amount</h2>
        <div className={`grid gap-3 ${priceContribute25Id ? 'sm:grid-cols-2' : ''}`}>
          {priceContribute25Id ? (
            <button
              type="button"
              onClick={() => setSelectedTier('CONTRIBUTE_25')}
              className={`rounded-xl border p-4 text-left transition-colors ${
                selectedTier === 'CONTRIBUTE_25'
                  ? 'border-[#A3C2B2] bg-[#163d27]/80'
                  : 'border-[#163d27] bg-[#163d27]/40 hover:bg-[#163d27]/60'
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#A3C2B2]" />
                <span className="font-semibold text-white">$25</span>
                {isMonthly ? (
                  <span className="text-xs text-[#A3C2B2]/70">/month</span>
                ) : null}
              </div>
              <p className="text-sm text-[#A3C2B2]">Support the program</p>
              <p className="mt-1 text-xs text-[#A3C2B2]/70">
                Every dollar helps us reach more families.
              </p>
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setSelectedTier('FAMILY_BAG')}
            className={`rounded-xl border p-4 text-left transition-colors ${
              selectedTier === 'FAMILY_BAG'
                ? 'border-white bg-white/10'
                : 'border-[#163d27] bg-[#163d27]/40 hover:bg-[#163d27]/60'
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-white" />
              <span className="font-semibold text-white">$50</span>
              {isMonthly ? (
                <span className="text-xs text-[#A3C2B2]/70">/month</span>
              ) : null}
            </div>
            <p className="text-sm text-[#A3C2B2]">Full bag for a family</p>
            <p className="mt-1 text-xs text-[#A3C2B2]/70">
              A complete grocery bag delivered to a Tasmanian household.
            </p>
          </button>
        </div>
      </div>

      {isFullBag ? (
        <>
          <div>
            <div className="overflow-hidden rounded-xl border border-[#163d27]">
              <Image
                src="/grocery-bag.jpg"
                alt="A $50 bag of groceries including fresh fruit, vegetables, chicken, mince, eggs, milk, pasta, bread, and pantry staples"
                width={768}
                height={1024}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <p className="mt-2 text-center text-sm text-[#A3C2B2]/70">
              What a $50 bag of groceries looks like
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">
              {isMonthly ? 'How many bags per month?' : 'How many bags of groceries?'}
            </h2>
            <ProgressDial quantity={quantity} />
            <div className="mt-6 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#163d27] bg-[#163d27]/60 text-white transition-colors hover:bg-[#163d27] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Remove one bag"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="min-w-[120px] text-center">
                <p className="text-sm text-[#A3C2B2]">
                  {quantity} × $50{isMonthly ? '/month' : ''} =
                </p>
                <p className="text-2xl font-bold text-white">
                  ${total}{isMonthly ? '/month' : '.00'}
                </p>
              </div>
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= MAX_BAGS}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#163d27] bg-[#163d27]/60 text-white transition-colors hover:bg-[#163d27] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Add one bag"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : null}

      {/* Donor details */}
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="priceId" value={selectedPriceId} />
        <input type="hidden" name="quantity" value={isFullBag ? quantity : 1} />
        <input type="hidden" name="givingFrequency" value={givingFrequency} />

        <h2 className="text-lg font-semibold text-white">Your details</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[#A3C2B2]">First Name *</Label>
            <Input
              id="firstName" name="firstName" placeholder="Jane" required
              autoComplete="given-name"
              className="border-[#163d27] bg-[#163d27]/40 text-white placeholder:text-[#A3C2B2]/50 focus:border-[#A3C2B2]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[#A3C2B2]">Last Name *</Label>
            <Input
              id="lastName" name="lastName" placeholder="Smith" required
              autoComplete="family-name"
              className="border-[#163d27] bg-[#163d27]/40 text-white placeholder:text-[#A3C2B2]/50 focus:border-[#A3C2B2]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#A3C2B2]">Email Address *</Label>
          <Input
            id="email" name="email" type="email" placeholder="jane@example.com" required
            autoComplete="email"
            className="border-[#163d27] bg-[#163d27]/40 text-white placeholder:text-[#A3C2B2]/50 focus:border-[#A3C2B2]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-[#A3C2B2]">
            Message <span className="font-normal text-[#A3C2B2]/60">(optional)</span>
          </Label>
          <Textarea
            id="message" name="message" rows={3} maxLength={500}
            placeholder="Leave a supportive message to your impacted family"
            className="border-[#163d27] bg-[#163d27]/40 text-white placeholder:text-[#A3C2B2]/50 focus:border-[#A3C2B2]"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit" size="lg"
          className="btn-glow w-full bg-white text-[#1c4d31] hover:bg-[#F4F7F5]"
          disabled={isPending}
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Redirecting to payment...</>
          ) : (
            <><ShoppingBag className="h-4 w-4" />{submitLabel}</>
          )}
        </Button>

        <p className="text-center text-xs text-[#A3C2B2]/60">
          Payments processed securely via Stripe.
          {isFullBag && !isMonthly ? ' Have a coupon code? Enter it on the payment page.' : null}
        </p>
      </form>

      {/* Business sponsor */}
      <div className="border-t border-[#163d27] pt-6 text-center">
        <p className="mb-3 text-sm text-[#A3C2B2]">
          Representing a business?
        </p>
        <Button
          asChild
          variant="outline"
          className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          <a href="/contact">
            Get in touch about a bulk order or sponsorship
          </a>
        </Button>
      </div>
    </div>
  )
}
