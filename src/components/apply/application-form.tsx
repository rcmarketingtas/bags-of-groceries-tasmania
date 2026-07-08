'use client'

import { useActionState } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitApplication } from '@/actions/apply'

const initialState = null

export function ApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialState,
  )

  if (state?.success) {
    return (
      <div className="rounded-xl border border-[#D5E0DA] bg-[#3d6b51]/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#1c4d31]" />
        <h2 className="mb-2 text-xl font-semibold text-black">
          Application Submitted
        </h2>
        <p className="text-[#1c4d31]/80">
          Thank you for reaching out. We&apos;ve received your application and
          will be in touch within 3–5 business days. Please check your email
          for a confirmation.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Personal details */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#1c4d31]/60">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-black">First Name *</Label>
            <Input id="firstName" name="firstName" placeholder="Jane" required autoComplete="given-name"
              className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-black">Last Name *</Label>
            <Input id="lastName" name="lastName" placeholder="Smith" required autoComplete="family-name"
              className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">Email Address *</Label>
            <Input id="email" name="email" type="email" placeholder="jane@example.com" required autoComplete="email"
              className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-black">Phone Number *</Label>
            <Input id="phone" name="phone" type="tel" placeholder="04xx xxx xxx" required autoComplete="tel"
              className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#1c4d31]/60">
          Address
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-black">Street Address *</Label>
            <Input id="address" name="address" placeholder="123 Main Street" required autoComplete="street-address"
              className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suburb" className="text-black">Suburb *</Label>
              <Input id="suburb" name="suburb" placeholder="Hobart" required autoComplete="address-level2"
                className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-black">Postcode *</Label>
              <Input id="postcode" name="postcode" placeholder="7000" maxLength={4} required autoComplete="postal-code"
                className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]" />
            </div>
          </div>
        </div>
      </div>

      {/* Family details */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#1c4d31]/60">
          Family Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adults" className="text-black">Number of Adults *</Label>
            <Input id="adults" name="adults" type="number" min={1} max={20} placeholder="2" required
              className="border-[#D5E0DA] bg-white text-black focus:border-[#1c4d31]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="children" className="text-black">Number of Children *</Label>
            <Input id="children" name="children" type="number" min={0} max={20} placeholder="0" required
              className="border-[#D5E0DA] bg-white text-black focus:border-[#1c4d31]" />
          </div>
        </div>
      </div>

      {/* Circumstances */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#1c4d31]/60">
          Your Circumstances
        </h2>
        <div className="space-y-2">
          <Label htmlFor="circumstances" className="text-black">
            Brief description of your situation *
          </Label>
          <Textarea
            id="circumstances" name="circumstances" rows={5} required maxLength={1000}
            placeholder="Please briefly describe your current circumstances and why you are seeking assistance..."
            className="border-[#D5E0DA] bg-white text-black placeholder:text-[#1c4d31]/30 focus:border-[#1c4d31]"
          />
          <p className="text-xs text-[#1c4d31]/60">
            Minimum 20 characters. Maximum 1000 characters.
          </p>
        </div>
      </div>

      {/* Confirmation */}
      <div className="rounded-xl border border-[#D5E0DA] bg-[#F4F7F5] p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox" name="confirmed" value="on"
            className="mt-1 h-4 w-4 rounded border-[#D5E0DA] text-[#1c4d31] accent-[#1c4d31]"
            required
          />
          <span className="text-sm text-[#1c4d31]/80">
            I confirm that the information provided in this application is
            accurate and truthful to the best of my knowledge.
          </span>
        </label>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <Button type="submit" size="lg" className="btn-glow w-full bg-[#1c4d31] text-white hover:bg-[#163d27]" disabled={isPending}>
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Submitting Application...</>
        ) : (
          'Submit Application'
        )}
      </Button>

      <p className="text-center text-xs text-[#1c4d31]/60">
        Your information is kept private and used only to assess your application for assistance.
      </p>
    </form>
  )
}
