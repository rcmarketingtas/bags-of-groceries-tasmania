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
      <div className="rounded-xl border border-[#3d6b51]/30 bg-[#3d6b51]/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#3d6b51]" />
        <h2 className="mb-2 text-xl font-semibold text-white">
          Application Submitted
        </h2>
        <p className="text-muted-foreground">
          Thank you for reaching out. We&apos;ve received your application and will
          be in touch within 3–5 business days. Please check your email for a
          confirmation.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Personal details */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Jane"
              required
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Smith"
              required
              autoComplete="family-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="04xx xxx xxx"
              required
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Address
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main Street"
              required
              autoComplete="street-address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb *</Label>
              <Input
                id="suburb"
                name="suburb"
                placeholder="Hobart"
                required
                autoComplete="address-level2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                name="postcode"
                placeholder="7000"
                maxLength={4}
                required
                autoComplete="postal-code"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Family details */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Family Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adults">Number of Adults *</Label>
            <Input
              id="adults"
              name="adults"
              type="number"
              min={1}
              max={20}
              placeholder="2"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="children">Number of Children *</Label>
            <Input
              id="children"
              name="children"
              type="number"
              min={0}
              max={20}
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Circumstances */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your Circumstances
        </h2>
        <div className="space-y-2">
          <Label htmlFor="circumstances">
            Brief description of your situation *
          </Label>
          <Textarea
            id="circumstances"
            name="circumstances"
            placeholder="Please briefly describe your current circumstances and why you are seeking assistance..."
            rows={5}
            required
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground">
            Minimum 20 characters. Maximum 1000 characters.
          </p>
        </div>
      </div>

      {/* Confirmation */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="confirmed"
            value="on"
            className="mt-1 h-4 w-4 rounded border-white/20 text-primary"
            required
          />
          <span className="text-sm text-muted-foreground">
            I confirm that the information provided in this application is
            accurate and truthful to the best of my knowledge.
          </span>
        </label>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting Application...
          </>
        ) : (
          'Submit Application'
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Your information is kept private and used only to assess your
        application for assistance.
      </p>
    </form>
  )
}
