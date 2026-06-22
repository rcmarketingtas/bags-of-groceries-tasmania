import type { Metadata } from 'next'
import { ShieldCheck, Lock, ShoppingBag, Utensils, Users, TrendingUp } from 'lucide-react'
import { DonationForm } from '@/components/sponsor/donation-form'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Buy a Bag of Groceries',
  description: 'Buy a bag of groceries for a Tasmanian family doing it tough. $50 per bag.',
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
    <div className="min-h-screen">
      {/* Sage header — Theme A */}
      <section className="section-sage py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Buy a Bag of Groceries for a Family
          </h1>
          {/* Transparency strip */}
          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="h-4 w-4 text-white" />
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
                className="font-medium text-white underline underline-offset-2 transition-opacity hover:opacity-75"
              >
                Follow us on Facebook
              </a>
              <span className="text-[#A3C2B2]"> to see the impact.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hunger stat banner — White B (no external image dependency) */}
      <section className="section-white py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-[#D5E0DA] bg-[#F4F7F5]">
            <div className="grid grid-cols-1 divide-y divide-[#D5E0DA] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                {
                  icon: TrendingUp,
                  stat: '1 in 5',
                  label: 'Australians face food insecurity',
                  sub: 'Foodbank Australia, 2023',
                },
                {
                  icon: Users,
                  stat: 'Higher',
                  label: 'Rate in Tasmania than the national average',
                  sub: 'Foodbank Australia, 2023',
                },
                {
                  icon: Utensils,
                  stat: '$50',
                  label: 'Covers a full bag of essentials for one family',
                  sub: 'Groceries + delivery',
                },
              ].map(({ icon: Icon, stat, label, sub }) => (
                <div key={stat} className="flex flex-col items-center px-6 py-8 text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#3d6b51]/10">
                    <Icon className="h-5 w-5 text-[#1c4d31]" />
                  </div>
                  <p className="text-2xl font-bold text-black">{stat}</p>
                  <p className="mt-1 text-sm text-[#1c4d31]/80">{label}</p>
                  <p className="mt-1 text-xs text-[#1c4d31]/50">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form — Sage A */}
      <section className="section-sage py-12 pb-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="card-dark p-6 sm:p-8">
            <DonationForm priceFamilyBagId={priceFamilyBagId} />
          </div>

          {/* Trust signals */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 text-sm text-[#A3C2B2]">
              <Lock className="h-4 w-4 text-white" />
              Secure payment via Stripe
            </div>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-2 text-sm text-[#A3C2B2]">
              <ShieldCheck className="h-4 w-4 text-white" />
              Your details are protected
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
