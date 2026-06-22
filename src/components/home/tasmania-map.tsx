'use client'

import dynamic from 'next/dynamic'

const TasmaniaMapClient = dynamic(
  () => import('./tasmania-map-client'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-xl bg-[#162019]" />
    ),
  }
)

export function TasmaniaMap() {
  return (
    <section className="section-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Delivering across Tasmania
          </h2>
          <p className="text-[#1c4d31]">
            Based in Launceston, delivering to families anywhere in Tassie.
          </p>
        </div>
        <div className="h-96 overflow-hidden rounded-2xl border border-[#D5E0DA] shadow-lg">
          <TasmaniaMapClient />
        </div>
      </div>
    </section>
  )
}
