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
    <section className="dark-page py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-heading mb-3 text-3xl text-white sm:text-4xl">
            Delivering across Tasmania
          </h2>
          <p className="text-white/60">
            Based in Launceston, delivering to families anywhere in Tassie.
          </p>
        </div>
        <div className="h-96 overflow-hidden rounded-xl shadow-2xl">
          <TasmaniaMapClient />
        </div>
      </div>
    </section>
  )
}
