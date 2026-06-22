import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Users } from 'lucide-react'

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
            <Heart className="h-3.5 w-3.5 fill-primary" />
            Supporting Tasmanian Families
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Help Put Food
            <span className="text-primary"> on the Table</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Support Tasmanian families experiencing hardship by sponsoring
            grocery bags. Every contribution makes a real difference in
            someone&apos;s life.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/sponsor">
                <Heart className="h-5 w-5" />
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

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-12">
            {[
              { value: '$25', label: 'sponsors one bag' },
              { value: '100%', label: 'goes to families' },
              { value: 'TAS', label: 'families supported' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl">
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
