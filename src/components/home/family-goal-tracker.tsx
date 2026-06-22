'use client'

import { AnimatedCounter } from './animated-counter'

const GOAL_2026 = 1000

interface FamilyGoalTrackerProps {
  familiesCount: number
}

export function FamilyGoalTracker({ familiesCount }: FamilyGoalTrackerProps) {
  const progress = Math.min((familiesCount / GOAL_2026) * 100, 100)

  return (
    <div className="rounded-2xl border border-white/20 bg-[#1c4d31]/60 p-6 sm:p-8">
      <p className="text-sm font-medium uppercase tracking-wider text-white/80">
        2026 goal
      </p>
      <p className="mt-2 text-4xl font-bold tabular-nums text-white sm:text-5xl">
        <AnimatedCounter target={familiesCount} />
        <span className="text-2xl font-semibold text-white/70 sm:text-3xl">
          {' '}
          / {GOAL_2026.toLocaleString()}
        </span>
      </p>
      <p className="mt-2 text-base text-white">
        Tasmanian families fed so far
      </p>

      <div className="mt-6">
        <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${Math.max(progress, familiesCount > 0 ? 2 : 0)}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-white/80">
          Our goal: 1,000 Tasmanian families in 2026
        </p>
      </div>
    </div>
  )
}
