import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function ContactCTA() {
  return (
    <section className="section-white py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3d6b51]/10">
          <MessageCircle className="h-6 w-6 text-[#1c4d31]" />
        </div>
        <h2 className="mb-3 text-3xl font-bold text-black sm:text-4xl">
          Got a Question?
        </h2>
        <p className="mb-8 text-lg text-[#1c4d31]">
          It&apos;s just us, Sunny and Raquel. Flick us a message and
          we&apos;ll get back to you as soon as we can.
        </p>
        <Button
          asChild
          size="lg"
          className="btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]"
        >
          <Link href="/contact">Send Us a Message</Link>
        </Button>
      </div>
    </section>
  )
}
