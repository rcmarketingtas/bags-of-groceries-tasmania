import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function ContactCTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#3d6b51]/20 bg-[#3d6b51]/5 p-10 text-center shadow-[0_0_40px_rgba(61,107,81,0.1)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3d6b51]/20">
            <MessageCircle className="h-6 w-6 text-[#3d6b51]" />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Got a Question?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            It&apos;s just us, Sunny and Raquel. Flick us a message and
            we&apos;ll get back to you as soon as we can.
          </p>
          <Button
            asChild
            size="lg"
            className="btn-glow bg-[#3d6b51] text-white hover:bg-[#4a7d61]"
          >
            <Link href="/contact">Send Us a Message</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
