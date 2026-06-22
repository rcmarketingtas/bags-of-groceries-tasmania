import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Users, MapPin, Eye } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-20 md:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <ShoppingBag className="h-3.5 w-3.5" />
            Supporting Tasmanian Families
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Help Put Food
            <span className="text-primary"> on the Table</span>
          </h1>

          <p className="mb-4 text-lg text-muted-foreground sm:text-xl">
            We&apos;re two locals from Launceston who want to help Tasmanian
            families doing it tough — starting with something simple: groceries.
          </p>

          <p className="mb-10 text-base text-muted-foreground">
            Sponsor a bag and we&apos;ll make sure it gets to a family that
            needs it.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/sponsor">
                <ShoppingBag className="h-5 w-5" />
                Sponsor a Bag
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/apply">
                <Users className="h-5 w-5" />
                Apply for Assistance
              </Link>
            </Button>
          </div>

          {/* Impact stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-12">
            {[
              { icon: ShoppingBag, value: '$25', label: 'Sponsors a grocery bag' },
              { icon: MapPin, value: 'Local', label: 'Supporting Tasmanian families' },
              { icon: Eye, value: 'Transparent', label: 'Community-driven grocery assistance' },
            ].map((stat) => (
              <div key={stat.value} className="text-center">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <div className="text-xl font-bold text-primary sm:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
