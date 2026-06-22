'use client'

import { useState, useTransition } from 'react'
import { ShoppingBag, Check, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { createCheckoutSession } from '@/actions/donate'

const packages = [
  {
    id: 'one-bag',
    name: 'Sponsor 1 Bag',
    price: '$25',
    bags: 1,
    description: 'Provide one full grocery bag to a Tasmanian family in need.',
    priceIdEnv: 'NEXT_PUBLIC_STRIPE_PRICE_1_BAG',
  },
  {
    id: 'two-bags',
    name: 'Sponsor 2 Bags',
    price: '$50',
    bags: 2,
    description: 'Double your impact — provide two bags to families in need.',
    priceIdEnv: 'NEXT_PUBLIC_STRIPE_PRICE_2_BAGS',
    popular: true,
  },
]

interface DonationFormProps {
  price1BagId: string
  price2BagsId: string
}

export function DonationForm({ price1BagId, price2BagsId }: DonationFormProps) {
  const [selectedId, setSelectedId] = useState<string>('two-bags')
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  const priceMap: Record<string, string> = {
    'one-bag': price1BagId,
    'two-bags': price2BagsId,
  }

  async function handleSubmit(formData: FormData) {
    setError(undefined)
    formData.set('priceId', priceMap[selectedId] ?? '')

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
      {/* Package selection */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          1. Choose your sponsorship
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {packages.map((pkg) => {
            const isSelected = selectedId === pkg.id
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedId(pkg.id)}
                className={cn(
                  'relative rounded-xl border-2 p-5 text-left transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white hover:border-primary/50',
                )}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-4 rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag
                      className={cn(
                        'h-5 w-5',
                        isSelected ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    <span className="font-semibold text-gray-900">
                      {pkg.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="mb-2 text-3xl font-bold text-primary">
                  {pkg.price}
                </div>
                <p className="text-sm text-muted-foreground">
                  {pkg.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Donor details form */}
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="priceId" value={priceMap[selectedId] ?? ''} />

        <h2 className="text-lg font-semibold text-gray-900">
          2. Your details
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
            <span className="text-muted-foreground font-normal">(optional)</span>
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
              Proceed to Secure Payment
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Payments processed securely via Stripe. You will be redirected to
          complete your payment.
        </p>
      </form>
    </div>
  )
}
