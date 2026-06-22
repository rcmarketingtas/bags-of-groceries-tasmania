import type { Metadata } from 'next'
import { Mail, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Bags of Groceries Tasmania team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question or want to learn more? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="mb-4 font-semibold text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-muted-foreground">
                      hello@bagsofgroceries.org.au
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Location
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tasmania, Australia
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Response Time
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Within 1–2 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary p-6 text-white">
              <h3 className="mb-2 font-semibold">Need urgent assistance?</h3>
              <p className="mb-4 text-sm text-primary-foreground/80">
                If your family needs immediate support, please submit an
                assistance application and we will prioritise your request.
              </p>
              <a
                href="/apply"
                className="inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors"
              >
                Apply for Assistance
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
