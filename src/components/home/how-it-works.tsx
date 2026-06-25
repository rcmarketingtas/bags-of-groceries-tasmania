import { ShoppingBag, Package, Heart } from 'lucide-react'

const steps = [
  {
    icon: ShoppingBag,
    title: 'Give a Bag of Groceries',
    description:
      'Pick how many bags you want to give. Your money goes straight toward groceries for a Tassie family doing it tough.',
  },
  {
    icon: Package,
    title: 'Groceries Are Packed',
    description:
      'We put together bags filled with the basics: fresh produce, pantry staples, and everyday household essentials.',
  },
  {
    icon: Heart,
    title: 'Families Receive Support',
    description:
      'Families we\u2019ve approved get their bags. Real food, real help, right here in Tasmania.',
  },
]

export function HowItWorks() {
  return (
    <section className="section-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
            How It Works
          </h2>
          <p className="text-[#1c4d31]">Three simple steps that make a real difference.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="card-light p-7 text-center">
              <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#3d6b51]/15">
                <step.icon className="h-6 w-6 text-[#1c4d31]" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1c4d31] text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-black">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#1c4d31]/80">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
