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
    <div className="dark-page min-h-screen py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading mb-3 text-4xl text-white sm:text-5xl">
            Buy a Bag of Groceries for a Family
          </h1>
        </div>

        {/* Transparency */}
        <div className="mb-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <ShoppingBag className="h-4 w-4 text-green-400" />
            <span className="font-medium text-white">
              {totalBags} bags delivered so far
            </span>
          </div>
          <div className="hidden h-4 w-px bg-white/20 sm:block" />
          <div className="text-sm">
            <a
              href="https://www.facebook.com/bagsofgroceriestasmania"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-green-400 underline underline-offset-2 hover:text-green-300"
            >
              Follow us on Facebook
            </a>
            <span className="text-white/50"> to see the impact.</span>
          </div>
        </div>

        {/* Hunger statistic */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <div className="relative">
            <div className="h-48 w-full overflow-hidden rounded-xl bg-[#162019]">
              <Image
                src="/groceries.jpg"
                alt="Groceries for Tasmanian families"
                fill
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">
                  1 in 5 Australians face food insecurity.
                </p>
                <p className="mt-2 text-white/70">
                  In Tasmania, the rate is even higher.
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Foodbank Australia, 2023
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-xl bg-[#162019] p-6 shadow-sm ring-1 ring-white/10 sm:p-8">
          <DonationForm priceFamilyBagId={priceFamilyBagId} />
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Lock className="h-4 w-4 text-green-400" />
            Secure payment via Stripe
          </div>
          <div className="hidden h-4 w-px bg-white/20 sm:block" />
          <div className="flex items-center gap-2 text-sm text-white/50">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            Your details are protected
          </div>
        </div>
      </div>
    </div>
  )
}
