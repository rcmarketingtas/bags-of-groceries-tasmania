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
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#3d6b51]/20 ring-1 ring-[#3d6b51]/30">
          <CheckCircle2 className="h-10 w-10 text-[#3d6b51]" />
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Thank You for Your Support
        </h1>

        <p className="mb-8 text-lg text-muted-foreground">
          Your donation has been received and processed. You&apos;ve just
          helped put food on the table for a Tasmanian family in need.
        </p>

        {/* What happens next */}
        <div className="form-card mb-10 p-6 text-left">
          <h2 className="mb-4 font-semibold text-white">What happens next?</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/20 text-xs font-bold text-[#3d6b51]">
                1
              </span>
              You&apos;ll receive a donation receipt by email shortly.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/20 text-xs font-bold text-[#3d6b51]">
                2
              </span>
              We&apos;ll pack a bag with the essentials for a Tasmanian family.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/20 text-xs font-bold text-[#3d6b51]">
                3
              </span>
              An approved Tasmanian family will receive the groceries.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="btn-glow bg-[#3d6b51] text-white hover:bg-[#4a7d61]"
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
            className="border-white/15 bg-transparent text-white/80 hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {/* Share prompt */}
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
          <Share2 className="mx-auto mb-2 h-6 w-6 text-[#3d6b51]" />
          <p className="text-sm font-medium text-white">Spread the word</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell your friends and family about Bags of Groceries Tasmania.
            Every share helps us reach more supporters.
          </p>
        </div>
      </div>
    </div>
  )
}
