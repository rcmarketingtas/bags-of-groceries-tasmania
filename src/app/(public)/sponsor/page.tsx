import type { Metadata } from 'next'
import { ShieldCheck, Lock } from 'lucide-react'
import { DonationForm } from '@/components/sponsor/donation-form'

export const metadata: Metadata = {
  title: 'Buy a Bag of Groceries',
  description:
    'Buy a bag of groceries for a Tasmanian family doing it tough. $50 per bag — every dollar goes to the groceries.',
}

export default function SponsorPage() {
  const priceFamilyBagId = process.env.STRIPE_PRICE_FAMILY_BAG!

  return (
    <div className="min-h-screen bg-[#FDFAF7] py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Buy a Bag of Groceries for a Family
          </h1>
          <p className="text-lg text-muted-foreground">
            $50 per bag. Every dollar goes toward the groceries — nothing
            taken out for admin or fees.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <DonationForm priceFamilyBagId={priceFamilyBagId} />
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            Secure payment via Stripe
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Your details are protected
          </div>
        </div>
      </div>
    </div>
  )
}
