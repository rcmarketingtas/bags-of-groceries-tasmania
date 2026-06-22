import { CreditCard, ShoppingCart, Home } from 'lucide-react'

const steps = [
  {
    icon: CreditCard,
    step: '01',
    title: 'Sponsor a Grocery Bag',
    description:
      'Choose to sponsor one or two grocery bags for $25 or $50. Your secure payment goes directly to funding groceries for a Tasmanian family.',
  },
  {
    icon: ShoppingCart,
    step: '02',
    title: 'Groceries Are Prepared',
    description:
      'Our supermarket partner prepares a full grocery bag filled with essential items — fresh produce, staples, and household necessities.',
  },
  {
    icon: Home,
    step: '03',
    title: 'Families Receive Support',
    description:
      'Approved families receive their grocery bags, providing immediate relief and dignity during a difficult time in their lives.',
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
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A simple, transparent process that connects generous sponsors with
            Tasmanian families in need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.step} className="relative text-center">
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
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
