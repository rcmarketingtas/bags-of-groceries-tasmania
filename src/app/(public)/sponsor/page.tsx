import type { Metadata } from 'next'
import Image from 'next/image'
import { ShieldCheck, Lock, ShoppingBag } from 'lucide-react'
import { DonationForm } from '@/components/sponsor/donation-form'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Buy a Bag of Groceries',
  description:
    'Buy a bag of groceries for a Tasmanian family doing it tough. $50 per bag.',
}

async function getTotalBagsDelivered(): Promise<number> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('donations').select('bags')
    if (!data) return 0
    return data.reduce((sum, row) => sum + (row.bags ?? 0), 0)
  } catch {
    return 0
  }
}

export default async function SponsorPage() {
  const priceFamilyBagId = process.env.STRIPE_PRICE_FAMILY_BAG!
  const totalBags = await getTotalBagsDelivered()

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Buy a Bag of Groceries for a Family
          </h1>
        </div>

        {/* Transparency strip */}
        <div className="mb-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingBag className="h-4 w-4 text-[#3d6b51]" />
            <span className="font-medium text-white">
              {totalBags} bags delivered so far
            </span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="text-sm">
            <a
              href="https://www.facebook.com/bagsofgroceriestasmania"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#3d6b51] underline underline-offset-2 transition-colors hover:text-[#4a7d61]"
            >
              Follow us on Facebook
            </a>
            <span className="text-muted-foreground"> to see the impact.</span>
          </div>
        </div>

        {/* Hunger stat banner */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <div className="relative h-48 w-full bg-[#0f1623]">
            <Image
              src="/groceries.jpg"
              alt="Groceries for Tasmanian families"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">
                1 in 5 Australians face food insecurity.
              </p>
              <p className="mt-2 text-muted-foreground">
                In Tasmania, the rate is even higher.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Foodbank Australia, 2023
              </p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="form-card p-6 sm:p-8">
          <DonationForm priceFamilyBagId={priceFamilyBagId} />
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-[#3d6b51]" />
            Secure payment via Stripe
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#3d6b51]" />
            Your details are protected
          </div>
        </div>
      </div>
    </div>
  )
}
