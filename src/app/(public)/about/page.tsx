import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Bags of Groceries Tasmania — started by two locals from Launceston who wanted to help families doing it tough.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 opacity-80" />
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">About Us</h1>
          <p className="text-lg text-primary-foreground/80">
            Two locals from Launceston who wanted to do more than just talk
            about the problem.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/founders.webp"
                alt="Sunny Beatson and Raquel Cuevas"
                width={600}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Our Story
              </h2>
              <p>
                We&apos;re Sunny Beatson and Raquel Cuevas — two young people
                from Launceston who grew up watching hardship affect people
                around us. Not strangers. Neighbours, friends, families we
                knew.
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
                what they&apos;d do for groceries. For families who are genuinely
                going without. So we built this — no big backing, no grants,
                just the two of us trying to connect people who want to give
                with families who need a hand.
              </p>
              <p>
                We&apos;re based in Launceston but this is for all of Tassie.
                If you&apos;re doing it tough, reach out. If you want to help,
                sponsor a bag. It&apos;s really that simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we believe */}
      <section className="bg-[#FDFAF7] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
            What we believe
          </h2>
          <ul className="space-y-4">
            {[
              'Nobody in Tasmania should go without food.',
              'Asking for help takes courage — we\u2019ll never make it harder than it needs to be.',
              'Every dollar that comes in goes toward actual groceries, nothing else.',
              'Communities are stronger when people look out for each other.',
              'This doesn\u2019t need to be complicated — just people helping people.',
            ].map((belief) => (
              <li key={belief} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">{belief}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How the program works */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <div className="space-y-6">
            {[
              {
                title: 'Someone sponsors a bag',
                description:
                  'A generous person — maybe you — visits the site and pays for one or two grocery bags.',
              },
              {
                title: 'A family applies',
                description:
                  'Families doing it tough fill in a short application. We keep it simple — no jumping through hoops.',
              },
              {
                title: 'We review it',
                description:
                  'Sunny and Raquel go through each application personally. We treat every one with respect.',
              },
              {
                title: 'Groceries get packed',
                description:
                  'We put together bags with the basics — fresh produce, pantry staples, everyday essentials.',
              },
              {
                title: 'The family gets their groceries',
                description:
                  'That\u2019s it. Food on the table. That\u2019s what this is all about.',
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-4 text-3xl font-bold">Want to get involved?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Sponsor a bag or reach out — we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/sponsor">Sponsor a Bag</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
