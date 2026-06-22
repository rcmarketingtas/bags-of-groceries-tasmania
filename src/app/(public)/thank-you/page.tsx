import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Thank You for Your Support',
  description: 'Your donation has been received. Thank you for supporting Tasmanian families.',
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen">
      {/* Sage hero */}
      <section className="section-sage py-16 text-center">
        <div className="mx-auto max-w-xl px-4">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Thank You for Your Support
          </h1>
          <p className="text-lg text-[#A3C2B2]">
            Your donation has been received. You&apos;ve just helped put food
            on the table for a Tasmanian family in need.
          </p>
        </div>
      </section>

      {/* White content */}
      <section className="section-white py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          {/* What happens next */}
          <div className="card-light mb-10 p-6 text-left">
            <h2 className="mb-4 font-semibold text-black">What happens next?</h2>
            <ul className="space-y-3 text-sm text-[#1c4d31]/80">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/15 text-xs font-bold text-[#1c4d31]">
                  1
                </span>
                You&apos;ll receive a donation receipt by email shortly.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/15 text-xs font-bold text-[#1c4d31]">
                  2
                </span>
                We&apos;ll pack a bag with the essentials for a Tasmanian family.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/15 text-xs font-bold text-[#1c4d31]">
                  3
                </span>
                An approved Tasmanian family will receive the groceries.
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]"
            >
              <Link href="/sponsor">
                <Heart className="h-4 w-4" />
                Buy Another Bag of Groceries
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#D5E0DA] text-[#1c4d31] hover:bg-[#F4F7F5]"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {/* Share prompt */}
          <div className="rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-5">
            <Share2 className="mx-auto mb-2 h-6 w-6 text-[#1c4d31]" />
            <p className="text-sm font-medium text-black">Spread the word</p>
            <p className="mt-1 text-sm text-[#1c4d31]/80">
              Tell your friends and family about Bags of Groceries Tasmania.
              Every share helps us reach more supporters.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
