import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function ContactCTA() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <MessageCircle className="mx-auto mb-4 h-10 w-10 text-primary-foreground/80" />
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Have Questions?
        </h2>
        <p className="mb-8 text-lg text-primary-foreground/80">
          Our team is here to help. Whether you&apos;re a sponsor with questions
          about your donation, or a family needing guidance on applying, we&apos;d
          love to hear from you.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-primary hover:bg-gray-100"
        >
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </section>
  )
}
