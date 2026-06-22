import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function ContactCTA() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <MessageCircle className="mx-auto mb-4 h-10 w-10 text-primary-foreground/80" />
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Got a Question?
        </h2>
        <p className="mb-8 text-lg text-primary-foreground/80">
          It&apos;s just us — Sunny and Raquel. Flick us a message and
          we&apos;ll get back to you as soon as we can.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-primary hover:bg-gray-100"
        >
          <Link href="/contact">Send Us a Message</Link>
        </Button>
      </div>
    </section>
  )
}
