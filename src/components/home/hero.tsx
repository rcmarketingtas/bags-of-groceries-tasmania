import Link from 'next/link'
import { Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from './animated-counter'

interface HeroProps {
  familiesCount: number
}

const SITE_URL = 'https://bagsofgroceries.org.au'
const FB_SHARE_URL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`

export function Hero({ familiesCount }: HeroProps) {
  return (
    <section className="section-sage py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Help Put Food
            <br />
            <span className="text-[#A3C2B2]">on the Table</span>
          </h1>

          <p className="mb-4 text-lg text-[#A3C2B2] sm:text-xl">
            We&apos;re two locals who want to help Tasmanian families doing it
            tough, starting with something simple: groceries.
          </p>

          <p className="mb-10 text-base text-[#A3C2B2]/80">
            Buy a bag and we&apos;ll make sure it gets to a family that needs
            it.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="btn-glow w-full bg-[#1c4d31] text-white hover:bg-[#163d27] sm:w-auto"
            >
              <Link href="/sponsor">Buy a Bag of Groceries</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/apply">Apply for Assistance</Link>
            </Button>
          </div>

          {/* Live animated counter */}
          <div className="mt-16 border-t border-white/20 pt-12">
            <p className="text-5xl font-bold tabular-nums text-white">
              <AnimatedCounter target={familiesCount} />
            </p>
            <p className="mt-2 text-base text-[#A3C2B2]">
              Tasmanian families fed so far
            </p>

            {/* Facebook share nudge */}
            <a
              href={FB_SHARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
            >
              <Facebook className="h-4 w-4" />
              Share on Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
