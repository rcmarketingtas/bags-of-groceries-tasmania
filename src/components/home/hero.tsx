import { Facebook } from 'lucide-react'
import { FB_PAGE_URL } from '@/lib/facebook'
import { FamilyGoalTracker } from './family-goal-tracker'
import { HeroCTAs } from './hero-ctas'

interface HeroProps {
  familiesCount: number
}

export function Hero({ familiesCount }: HeroProps) {
  return (
    <section className="section-sage py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Copy + CTAs */}
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Help Put Food
              <br />
              <span className="text-white">on the Table</span>
            </h1>

            <p className="mb-4 text-lg text-white sm:text-xl">
              We&apos;re two locals who want to help Tasmanian families doing it
              tough, starting with something simple: groceries.
            </p>

            <p className="mb-10 text-base text-white/90">
              Give a bag and we&apos;ll make sure it gets to a family that needs
              it.
            </p>

            <div className="flex flex-col items-center gap-6 lg:items-start">
              <HeroCTAs layout="row" />

              <a
                href={FB_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow our Journey on Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all hover:scale-[1.02] hover:bg-white/20"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Goal tracker — beside heading on large screens */}
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <FamilyGoalTracker familiesCount={familiesCount} />
          </div>
        </div>
      </div>
    </section>
  )
}
