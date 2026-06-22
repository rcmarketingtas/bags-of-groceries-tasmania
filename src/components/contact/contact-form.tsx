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
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Message Sent
        </h2>
        <p className="text-muted-foreground">
          Thank you for getting in touch. We&apos;ll get back to you as soon as
          possible — usually within 1–2 business days.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Jane Smith"
          required
          autoComplete="name"
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
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="How can we help you?"
          rows={6}
          required
          maxLength={2000}
        />
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
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}
