import type { Metadata } from 'next'
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
    const { data } = await supabase
      .from('donations')
      .select('bags')
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
    <div className="min-h-screen bg-[#FDFAF7] py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Buy a Bag of Groceries for a Family
          </h1>
          <p className="text-lg text-muted-foreground">
            $50 per bag. Your purchase covers the cost of the groceries and
            running the program.
          </p>
        </div>

        {/* Transparency */}
        <div className="mb-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="font-medium text-gray-900">{totalBags} bags delivered so far</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="text-sm text-muted-foreground">
            <a
              href="https://www.facebook.com/bagsofgroceriestasmania"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Follow us on Facebook
            </a>
            {' '}to see the impact.
          </div>
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
