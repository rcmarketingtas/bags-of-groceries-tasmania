import Image from 'next/image'
import { Heart } from 'lucide-react'

export function WhoWeAre() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Photo */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/5">
              <Image
                src="/founders.webp"
                alt="Sunny Beatson and Raquel Cuevas, founders of Bags of Groceries Tasmania"
                width={600}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Sunny Beatson &amp; Raquel Cuevas, Founders
            </p>
          </div>

          {/* Story */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3d6b51]/30 bg-[#3d6b51]/10 px-4 py-1.5 text-sm font-medium text-[#3d6b51]">
              <Heart className="h-3.5 w-3.5 fill-[#3d6b51]" />
              Who We Are
            </div>

            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Started by two locals who wanted to do something real
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                We&apos;re Sunny and Raquel, and we&apos;ve watched more and
                more families around us struggle to get by. We wanted to
                actually do something about it, not just talk about it.
              </p>
              <p>
                It started when we sold donuts to raise money for Constable
                Keith Smith. The way the community showed up blew us away, the
                generosity, the warmth, the fact that people just wanted to
                help. That feeling stuck with us.
              </p>
              <p>
                So we thought: what if we could do that on a bigger scale? No
                big organisation behind us, just the two of us, trying to make
                sure families across Tassie have food on the table.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
