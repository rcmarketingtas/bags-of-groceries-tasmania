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
    <div className="min-h-screen bg-[#FDFAF7] py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Apply for Assistance
          </h1>
          <p className="text-lg text-muted-foreground">
            If your family is experiencing hardship and you need support,
            please complete this application. All information is kept
            confidential.
          </p>
        </div>

        {/* Privacy notice */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="text-sm text-blue-800">
            <strong>Your privacy matters.</strong> The information you provide
            is used only to assess your application and will never be shared
            with third parties.
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
          <ApplicationForm />
        </div>
      </div>
    </div>
  )
}
