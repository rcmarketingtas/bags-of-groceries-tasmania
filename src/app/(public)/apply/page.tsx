import type { Metadata } from 'next'
import { Shield } from 'lucide-react'
import { ApplicationForm } from '@/components/apply/application-form'

export const metadata: Metadata = {
  title: 'Apply for Assistance',
  description:
    'Tasmanian families experiencing hardship can apply for grocery assistance through Bags of Groceries Tasmania.',
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen">
      {/* Sage header */}
      <section className="section-sage py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Apply for Assistance
          </h1>
          <p className="text-lg text-[#A3C2B2]">
            If your family is experiencing hardship and you need support,
            please complete this application. All information is kept
            confidential.
          </p>
        </div>
      </section>

      {/* White form section */}
      <section className="section-white py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Privacy notice */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-4">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[#1c4d31]" />
            <div className="text-sm text-[#1c4d31]/80">
              <strong className="text-black">Your privacy matters.</strong> The
              information you provide is used only to assess your application
              and will never be shared with third parties.
            </div>
          </div>

          {/* Form card */}
          <div className="card-light p-6 sm:p-8">
            <ApplicationForm />
          </div>
        </div>
      </section>
    </div>
  )
}
