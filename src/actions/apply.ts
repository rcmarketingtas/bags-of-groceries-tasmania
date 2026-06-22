'use server'

import { createElement } from 'react'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { rateLimit } from '@/lib/rate-limit'
import { applicationSchema } from '@/lib/validations'
import ApplicationConfirmationEmail from '@/emails/application-confirmation'

export async function submitApplication(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  const { success: rateLimitOk } = await rateLimit(`apply:${ip}`)
  if (!rateLimitOk) {
    return { error: 'Too many requests. Please try again in a minute.' }
  }

  const raw = Object.fromEntries(formData.entries())
  const result = applicationSchema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const data = {
    firstName: result.data.firstName,
    lastName: result.data.lastName,
    email: result.data.email,
    phone: result.data.phone,
    address: result.data.address,
    suburb: result.data.suburb,
    postcode: result.data.postcode,
    adults: result.data.adults,
    children: result.data.children,
    circumstances: result.data.circumstances,
  }

  const supabase = await createClient()

  const { error: dbError } = await supabase.from('applications').insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    suburb: data.suburb,
    postcode: data.postcode,
    adults: data.adults,
    children: data.children,
    circumstances: data.circumstances,
    status: 'pending',
  })

  if (dbError) {
    console.error('DB error:', dbError)
    return { error: 'Failed to submit application. Please try again.' }
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Your application has been received — Bags of Groceries Tasmania',
      react: createElement(ApplicationConfirmationEmail, {
        firstName: data.firstName,
      }),
    })
  } catch (emailErr) {
    console.error('Email error:', emailErr)
    // Don't fail the request if email fails
  }

  return { success: true }
}
