'use client'

import { useActionState } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitContact } from '@/actions/contact'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null)

  if (state?.success) {
    return (
      <div className="rounded-xl border border-[#D5E0DA] bg-[#3d6b51]/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#1c4d31]" />
        <h2 className="mb-2 text-xl font-semibold text-black">Message Sent</h2>
        <p className="text-[#1c4d31]/80">
          Thank you for getting in touch. We&apos;ll get back to you as soon
          as possible, usually within a day or two.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-black">Your Name *</Label>
        <Input id="name" name="name" placeholder="Jane Smith" required autoComplete="name"
          className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-black">Email Address *</Label>
        <Input id="email" name="email" type="email" placeholder="jane@example.com" required autoComplete="email"
          className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-black">Message *</Label>
        <Textarea id="message" name="message" placeholder="How can we help you?" rows={6} required maxLength={2000}
          className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <Button type="submit" size="lg" className="btn-glow w-full bg-[#1c4d31] text-white hover:bg-[#163d27]" disabled={isPending}>
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}
