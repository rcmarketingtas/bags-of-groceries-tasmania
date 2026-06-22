import type { Metadata } from 'next'
import { Mail, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Bags of Groceries Tasmania team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            It&apos;s just us, Sunny and Raquel. Send us a message and
            we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Info sidebar */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="mb-4 font-semibold text-white">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/20">
                    <Mail className="h-4 w-4 text-[#3d6b51]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email</p>
                    <p className="text-sm text-muted-foreground">
                      hello@bagsofgroceries.org.au
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/20">
                    <MapPin className="h-4 w-4 text-[#3d6b51]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Location</p>
                    <p className="text-sm text-muted-foreground">
                      Launceston, Tasmania
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d6b51]/20">
                    <Clock className="h-4 w-4 text-[#3d6b51]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Response Time
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Usually within a day or two
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#3d6b51]/30 bg-[#3d6b51]/10 p-6">
              <h3 className="mb-2 font-semibold text-white">
                Need help right now?
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                If your family needs groceries urgently, put in an application
                and let us know and we&apos;ll do our best to move quickly.
              </p>
              <a
                href="/apply"
                className="btn-glow inline-block rounded-lg bg-[#3d6b51] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4a7d61]"
              >
                Apply for Assistance
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="form-card p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
