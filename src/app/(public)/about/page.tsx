import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Bags of Groceries Tasmania, started by two locals who wanted to help families doing it tough.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero — Sage A */}
      <section className="section-sage py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <ShoppingBag className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About Us
          </h1>
          <p className="text-lg text-[#A3C2B2]">
            Two locals who wanted to do more than just talk about the problem.
          </p>
        </div>
      </section>

      {/* Our story — White B */}
      <section className="section-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-[#D5E0DA]">
              <Image
                src="/founders.webp"
                alt="Sunny Beatson and Raquel Cuevas"
                width={600}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="space-y-5 text-base leading-relaxed text-[#1c4d31]/80">
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Our Story
              </h2>
              <p>
                We&apos;re Sunny Beatson and Raquel Cuevas. We saw more and
                more families around us struggling to get by. Not strangers.
                Neighbours, friends, families we knew.
              </p>
              <p>
                For a while we didn&apos;t know what to do about it. Then we
                started selling donuts to raise money for Constable Keith
                Smith. The response from the community was something we
                weren&apos;t prepared for. People gave generously, they showed
                up, and for a moment it felt like Tassie was pulling together.
                That experience changed how we thought about what was possible.
              </p>
              <p>
                We thought: if people will come together for donuts, imagine
                what they&apos;d do for groceries. For families who are
                genuinely going without. So we built this, no big backing, no
                grants, just the two of us trying to connect people who want to
                give with families who need a hand.
              </p>
              <p>
                We&apos;re based in Launceston but this is for all of Tassie.
                If you&apos;re doing it tough, reach out. If you want to help,
                buy a bag of groceries. It&apos;s really that simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we believe — Sage A */}
      <section className="section-sage py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What we believe
          </h2>
          <ul className="space-y-4">
            {[
              'Nobody in Tasmania should go without food.',
              'Asking for help takes courage. We\u2019ll never make it harder than it needs to be.',
              'Every dollar that comes in goes toward actual groceries, nothing else.',
              'Communities are stronger when people look out for each other.',
              'This doesn\u2019t need to be complicated. Just people helping people.',
            ].map((belief) => (
              <li key={belief} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-white/60" />
                <span className="text-[#A3C2B2]">{belief}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works — White B */}
      <section className="section-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-black sm:text-4xl">
            How it works
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Someone buys a bag of groceries',
                description: 'A generous person visits the site and pays for one or more grocery bags.',
              },
              {
                title: 'A family applies',
                description: 'Families doing it tough fill in a short application. We keep it simple, no jumping through hoops.',
              },
              {
                title: 'We review it',
                description: 'Sunny and Raquel go through each application personally. We treat every one with respect.',
              },
              {
                title: 'Groceries get packed',
                description: 'We put together bags with the basics: fresh produce, pantry staples, everyday essentials.',
              },
              {
                title: 'The family gets their groceries',
                description: 'That\u2019s it. Food on the table. That\u2019s what this is all about.',
              },
            ].map((step, index) => (
              <div key={index} className="card-light flex items-start gap-4 p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1c4d31] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-black">{step.title}</h3>
                  <p className="text-sm text-[#1c4d31]/80">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Sage A */}
      <section className="section-sage py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Want to get involved?
          </h2>
          <p className="mb-8 text-[#A3C2B2]">
            Buy a bag of groceries or reach out. We&apos;d love to hear from you.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]"
            >
              <Link href="/sponsor">Buy a Bag of Groceries</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
