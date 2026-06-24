import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { ReactElement } from 'react'

let _resend: Resend | null = null

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  if (!_resend) {
    _resend = new Resend(apiKey)
  }
  return _resend
}

export function getFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ??
    'Bags of Groceries Tasmania <noreply@bagsofgroceries.org.au>'
  )
}

export function getAdminNotifyEmails(): string[] {
  const raw = process.env.ADMIN_NOTIFY_EMAIL ?? ''
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
}

export function getResendConfigErrors(): string[] {
  const errors: string[] = []

  if (!process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is missing')
  } else if (!process.env.RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY must start with re_')
  }

  if (!process.env.RESEND_FROM_EMAIL) {
    errors.push('RESEND_FROM_EMAIL is missing')
  }

  if (getAdminNotifyEmails().length === 0) {
    errors.push('ADMIN_NOTIFY_EMAIL is missing (your email to receive notifications)')
  }

  return errors
}

async function renderEmailHtml(react: ReactElement): Promise<string> {
  return render(react)
}

export async function sendEmail(options: {
  to: string | string[]
  subject: string
  react: ReactElement
}): Promise<void> {
  const html = await renderEmailHtml(options.react)
  const { error } = await getResend().emails.send({
    from: getFromEmail(),
    to: options.to,
    subject: options.subject,
    html,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function sendAdminNotification(options: {
  subject: string
  react: ReactElement
  replyTo?: string
}): Promise<void> {
  const recipients = getAdminNotifyEmails()
  if (recipients.length === 0) {
    console.warn('ADMIN_NOTIFY_EMAIL not set — skipping admin notification')
    return
  }

  const html = await renderEmailHtml(options.react)
  const { error } = await getResend().emails.send({
    from: getFromEmail(),
    to: recipients,
    subject: options.subject,
    html,
    replyTo: options.replyTo,
  })

  if (error) {
    throw new Error(error.message)
  }
}
