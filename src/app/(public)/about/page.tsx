import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Target, Users, ShoppingBag, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about the mission, vision, and community impact of Bags of Groceries Tasmania.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 opacity-80" />
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">About Us</h1>
          <p className="text-lg text-primary-foreground/80">
            Bags of Groceries Tasmania was founded on a simple belief: no
            Tasmanian family should go without food.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                To provide immediate, dignified grocery assistance to Tasmanian
                families experiencing hardship — connecting the generosity of
                community sponsors with families who need support most.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Our Vision
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                A Tasmania where every family has access to nutritious food,
                and where community members look after one another during
                difficult times. We envision a network of support that spans
                the entire island.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Community Impact
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Every bag sponsored creates a direct, tangible impact in the
              lives of Tasmanian families. Hardship can affect anyone — from
              sudden job loss to medical emergencies or unexpected financial
              stress.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { value: '$25', label: 'sponsors one full grocery bag' },
                { value: '$50', label: 'supports a family for the week' },
                { value: '100%', label: 'of donations fund groceries' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-2 text-3xl font-bold text-primary">
                    {item.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How the program works */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            How the Program Works
          </h2>
          <div className="space-y-6">
            {[
              {
                title: 'Sponsors fund bags',
                description:
                  'Generous community members visit our website and choose to sponsor one or two grocery bags. Payments are processed securely through Stripe.',
              },
              {
                title: 'Families apply',
                description:
                  'Tasmanian families experiencing hardship submit an application through our website. All applications are reviewed confidentially by our team.',
              },
              {
                title: 'Applications are reviewed',
                description:
                  'Our administrators review each application carefully, considering the family\'s circumstances, size, and current situation.',
              },
              {
                title: 'Groceries are prepared',
                description:
                  'Approved families are matched with sponsored bags. Our supermarket partner prepares full grocery bags with essential items.',
              },
              {
                title: 'Families receive support',
                description:
                  'Grocery bags are provided to families, giving them immediate relief and the dignity of knowing their community cares.',
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <CheckCircle className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="mb-4 text-3xl font-bold">Ready to Help?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Join our community of sponsors and help put food on the table for
            Tasmanian families.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/sponsor">Sponsor a Bag</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/apply">Apply for Assistance</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
