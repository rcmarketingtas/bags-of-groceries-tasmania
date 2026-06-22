import { ShoppingBag, Package, Heart } from 'lucide-react'

const steps = [
  {
    icon: ShoppingBag,
    title: 'Sponsor a Grocery Bag',
    description:
      'Choose to sponsor one or more grocery bags. Your contribution helps fund essential groceries for a Tasmanian household experiencing hardship.',
  },
  {
    icon: Package,
    title: 'Groceries Are Packed',
    description:
      'Essential groceries are packed with a selection of pantry staples, fresh produce and household necessities.',
  },
  {
    icon: Heart,
    title: 'Families Receive Support',
    description:
      'Approved families receive their grocery bags, providing immediate relief and helping put food on the table during difficult times.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-y-1/2 bg-primary/20 md:block" />
              )}

              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                <step.icon className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {index + 1}. {step.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
