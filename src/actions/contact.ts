'use server'

import { createElement } from 'react'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAdminNotification, sendEmail } from '@/lib/resend'
import { rateLimit } from '@/lib/rate-limit'
import { contactSchema } from '@/lib/validations'
import ContactConfirmationEmail from '@/emails/contact-confirmation'
import AdminNewContactEmail from '@/emails/admin-new-contact'

function missingEnv(name: string): string {
  return `${name} is not set in environment variables`
}

export async function submitContact(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { error: missingEnv('NEXT_PUBLIC_SUPABASE_URL') }
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { error: missingEnv('SUPABASE_SERVICE_ROLE_KEY') }
    }

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'

    const { success: rateLimitOk } = await rateLimit(`contact:${ip}`)
    if (!rateLimitOk) {
      return { error: 'Too many requests. Please try again in a minute.' }
    }

    const raw = Object.fromEntries(formData.entries())
    const result = contactSchema.safeParse(raw)

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const { name, email, message } = result.data

    const supabase = createAdminClient()

    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({ name, email, message })

    if (dbError) {
      console.error('Contact DB error:', dbError)
      return { error: `Could not save message: ${dbError.message}` }
    }

    try {
      await sendEmail({
        to: email,
        subject: "We've received your message - Bags of Groceries Tasmania",
        react: createElement(ContactConfirmationEmail, { name }),
      })
    } catch (emailErr) {
      console.error('Contact confirmation email error:', emailErr)
    }

    try {
      await sendAdminNotification({
        subject: `New contact message from ${name}`,
        react: createElement(AdminNewContactEmail, { name, email, message }),
        replyTo: email,
      })
    } catch (emailErr) {
      console.error('Admin contact notification error:', emailErr)
    }

    return { success: true }
  } catch (err) {
    console.error('submitContact failed:', err)
    const message = err instanceof Error ? err.message : 'Unknown server error'
    return { error: `Submission failed: ${message}` }
  }
}
