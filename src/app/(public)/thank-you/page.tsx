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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Thank You for Your Support
        </h1>

        <p className="mb-8 text-lg text-muted-foreground">
          Your donation has been received and processed. You&apos;ve just helped
          put food on the table for a Tasmanian family in need.
        </p>

        {/* What happens next */}
        <div className="mb-10 rounded-xl border bg-white p-6 text-left shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">What happens next?</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              You&apos;ll receive a donation receipt by email shortly.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              Our supermarket partner will prepare your sponsored grocery bag.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              An approved Tasmanian family will receive the groceries.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/sponsor">
              <Heart className="h-4 w-4" />
              Sponsor Another Bag
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {/* Share prompt */}
        <div className="mt-10 rounded-lg bg-secondary/10 p-5">
          <Share2 className="mx-auto mb-2 h-6 w-6 text-secondary" />
          <p className="text-sm font-medium text-gray-800">
            Spread the word
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell your friends and family about Bags of Groceries Tasmania.
            Every share helps us reach more supporters.
          </p>
        </div>
      </div>
    </div>
  )
}
