import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Users } from 'lucide-react'

interface HeroProps {
  familiesCount: number
}

export function Hero({ familiesCount }: HeroProps) {
  return (
    <section className="dark-page py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading mb-6 text-5xl tracking-tight text-white sm:text-6xl md:text-7xl">
            Help Put Food
            <span className="text-green-400"> on the Table</span>
          </h1>

          <p className="mb-4 text-lg text-white/75 sm:text-xl">
            We&apos;re two locals who want to help Tasmanian families doing it
            tough, starting with something simple: groceries.
          </p>

          <p className="mb-10 text-base text-white/60">
            Buy a bag and we&apos;ll make sure it gets to a family that needs
            it.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-auto"
            >
              <Link href="/sponsor">
                <ShoppingBag className="h-5 w-5" />
                Buy a Bag of Groceries
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-white/30 text-white hover:bg-white/10 sm:w-auto"
            >
              <Link href="/apply">
                <Users className="h-5 w-5" />
                Apply for Assistance
              </Link>
            </Button>
          </div>

          {/* Live counter */}
          <div className="mt-14 border-t border-white/15 pt-10">
            <p className="text-5xl font-bold text-white">
              {familiesCount.toLocaleString()}
            </p>
            <p className="mt-2 text-base text-white/60">
              Tasmanian families fed so far
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
