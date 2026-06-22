'use server'

import { createElement } from 'react'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { rateLimit } from '@/lib/rate-limit'
import { contactSchema } from '@/lib/validations'
import ContactConfirmationEmail from '@/emails/contact-confirmation'

export async function submitContact(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  const { success: rateLimitOk } = await rateLimit(`contact:${ip}`)
  if (!rateLimitOk) {
    return { error: 'Too many requests. Please try again.' }
  }

  const raw = Object.fromEntries(formData.entries())
  const result = contactSchema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { name, email, message } = result.data

  const supabase = await createClient()

  const { error: dbError } = await supabase
    .from('contact_messages')
    .insert({ name, email, message })

  if (dbError) {
    console.error('DB error:', dbError)
    return { error: 'Failed to send message. Please try again.' }
  }

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We've received your message — Bags of Groceries Tasmania",
      react: createElement(ContactConfirmationEmail, { name }),
    })
  } catch (emailErr) {
    console.error('Email error:', emailErr)
  }

  return { success: true }
}
