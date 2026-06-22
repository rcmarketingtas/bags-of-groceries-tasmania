import Image from 'next/image'
import { Heart } from 'lucide-react'

export function WhoWeAre() {
  return (
    <section className="bg-primary/5 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Photo */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/founders.jpg"
                alt="Sunny Beatson and Raquel Cuevas, founders of Bags of Groceries Tasmania"
                width={600}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Sunny Beatson &amp; Raquel Cuevas — Founders
            </p>
          </div>

          {/* Story */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Heart className="h-3.5 w-3.5 fill-primary" />
              Who We Are
            </div>

            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Two Tasmanians who wanted to do something real
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Bags of Groceries Tasmania was started by Sunny Beatson and
                Raquel Cuevas — two locals who saw an increasing need for
                support within their community and wanted to do something real
                about it.
              </p>
              <p>
                It started small. When we helped raise money for Constable
                Keith Smith by selling donuts, the response from the community
                blew us away. The positivity, the connection, the sense that
                people genuinely wanted to help each other — it lit something
                up in us.
              </p>
              <p>
                We wanted to take that feeling and build something bigger with
                it. Something that brings Tasmanians together, puts food on
                tables, and makes this island a better place for the people who
                call it home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
