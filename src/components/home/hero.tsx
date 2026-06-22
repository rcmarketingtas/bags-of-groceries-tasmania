import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Users } from 'lucide-react'

interface HeroProps {
  familiesCount: number
}

export function Hero({ familiesCount }: HeroProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Help Put Food
            <span className="text-[#3d6b51]"> on the Table</span>
          </h1>

          <p className="mb-4 text-lg text-muted-foreground sm:text-xl">
            We&apos;re two locals who want to help Tasmanian families doing it
            tough, starting with something simple: groceries.
          </p>

          <p className="mb-10 text-base text-muted-foreground/80">
            Buy a bag and we&apos;ll make sure it gets to a family that needs
            it.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="btn-glow w-full bg-[#3d6b51] text-white hover:bg-[#4a7d61] sm:w-auto"
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
              className="w-full border-white/15 bg-transparent text-white/80 hover:border-white/30 hover:bg-white/5 hover:text-white sm:w-auto"
            >
              <Link href="/apply">
                <Users className="h-5 w-5" />
                Apply for Assistance
              </Link>
            </Button>
          </div>

          {/* Live counter */}
          <div className="mt-16 border-t border-white/10 pt-12">
            <p className="text-5xl font-bold text-white">
              {familiesCount.toLocaleString()}
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              Tasmanian families fed so far
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
