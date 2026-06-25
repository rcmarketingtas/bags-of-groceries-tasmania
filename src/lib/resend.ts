import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { ReactElement } from 'react'

let _resend: Resend | null = null

/** Resend sandbox/test domains — can only deliver to the account owner unless a custom domain is verified. */
const SANDBOX_FROM_PATTERNS = [/@resend\.dev$/i, /\.resend\.app$/i]

export class ResendSandboxError extends Error {
  readonly blockedRecipients: string[]

  constructor(message: string, blockedRecipients: string[]) {
    super(message)
    this.name = 'ResendSandboxError'
    this.blockedRecipients = blockedRecipients
  }
}

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; resendError?: { name: string; message: string } }

export function normalizeFromEmail(raw: string): string {
  return raw.trim().replace(/^['"]|['"]$/g, '')
}

/** Extract bare address from `Name <user@domain.com>` or return as-is. */
export function extractEmailAddress(from: string): string {
  const match = from.match(/<([^>]+)>/)
  return (match?.[1] ?? from).trim()
}

export function isResendSandboxFromAddress(fromEmail?: string): boolean {
  const addr = extractEmailAddress(fromEmail ?? getFromEmail())
  return SANDBOX_FROM_PATTERNS.some((pattern) => pattern.test(addr))
}

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
  const raw =
    process.env.RESEND_FROM_EMAIL ??
    'Bags of Groceries Tasmania <noreply@bagsofgroceries.org.au>'
  return normalizeFromEmail(raw)
}

/** Bare email only — used as fallback if display-name format is rejected. */
export function getFromEmailAddressOnly(): string {
  return extractEmailAddress(getFromEmail())
}

export function getAdminNotifyEmails(): string[] {
  const raw = process.env.ADMIN_NOTIFY_EMAIL ?? ''
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
}

export function getResendConfigWarnings(): string[] {
  const warnings: string[] = []

  const rawFrom = process.env.RESEND_FROM_EMAIL
  if (rawFrom && rawFrom !== normalizeFromEmail(rawFrom)) {
    warnings.push(
      'RESEND_FROM_EMAIL has surrounding quotes in env — remove them (use: Name <email@domain.com>)',
    )
  }

  if (isResendSandboxFromAddress()) {
    const fromAddr = extractEmailAddress(getFromEmail())
    warnings.push(
      `RESEND_FROM_EMAIL uses a Resend sandbox/test address (${fromAddr}). Resend only delivers to your account signup email until you verify a custom domain at resend.com/domains.`,
    )
    if (!process.env.RESEND_ACCOUNT_OWNER_EMAIL?.trim()) {
      warnings.push(
        'Set RESEND_ACCOUNT_OWNER_EMAIL to your Resend signup email for clearer sandbox errors, or verify your production domain.',
      )
    }
  }

  return warnings
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
  } else {
    const normalized = getFromEmail()
    const addr = extractEmailAddress(normalized)
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(addr)) {
      errors.push(
        `RESEND_FROM_EMAIL has invalid format: "${normalized}". Use "Display Name <email@domain.com>" or email@domain.com (no extra quotes).`,
      )
    }
  }

  if (getAdminNotifyEmails().length === 0) {
    errors.push(
      'ADMIN_NOTIFY_EMAIL is missing (your email to receive notifications)',
    )
  }

  return errors
}

/** Log Resend env issues once per request path before attempting sends. Never blocks sends. */
export function assertResendConfig(context: string): void {
  const errors = getResendConfigErrors()
  const warnings = getResendConfigWarnings()

  if (errors.length > 0) {
    console.error(`[resend] ${context} — configuration errors:`, errors)
  }
  if (warnings.length > 0) {
    console.warn(`[resend] ${context} — configuration warnings:`, warnings)
  }
}

function normalizeRecipients(to: string | string[]): string[] {
  const list = Array.isArray(to) ? to : [to]
  return list.map((e) => e.trim().toLowerCase()).filter(Boolean)
}

/**
 * Warn when sandbox FROM + owner email suggest a recipient will be rejected by Resend.
 * Does NOT block the API call — attempts must reach Resend so dashboard/logs show activity.
 */
export function warnSandboxRecipientMismatch(to: string | string[]): void {
  if (!isResendSandboxFromAddress()) {
    return
  }

  const owner = process.env.RESEND_ACCOUNT_OWNER_EMAIL?.trim().toLowerCase()
  if (!owner) {
    return
  }

  const recipients = normalizeRecipients(to)
  const likelyBlocked = recipients.filter((r) => r !== owner)

  if (likelyBlocked.length > 0) {
    console.warn(
      '[resend] sandbox recipient warning — send will still be attempted:',
      {
        from: getFromEmail(),
        to: recipients,
        likelyBlocked,
        allowedInSandbox: owner,
        hint: 'Verify a custom domain in Resend or test with RESEND_ACCOUNT_OWNER_EMAIL as the recipient.',
      },
    )
  }
}

type ResendApiError = { name: string; message: string }

function formatResendApiError(error: ResendApiError): string {
  let message = `${error.name}: ${error.message}`

  if (error.name === 'invalid_from_address') {
    message +=
      ' — verify RESEND_FROM_EMAIL domain in Resend dashboard (resend.com/domains).'
  }

  if (
    isResendSandboxFromAddress() &&
    /only send testing emails|verify a domain|not authorized/i.test(error.message)
  ) {
    message +=
      ' Resend sandbox only delivers to your account signup email; verify a custom domain or set RESEND_ACCOUNT_OWNER_EMAIL and test with that address.'
  }

  return message
}

function logResendFailure(
  operation: string,
  details: Record<string, unknown>,
  error: unknown,
): void {
  const payload: Record<string, unknown> = { ...details }

  if (error && typeof error === 'object' && 'name' in error && 'message' in error) {
    payload.resendError = {
      name: (error as ResendApiError).name,
      message: (error as ResendApiError).message,
    }
  } else if (error instanceof Error) {
    payload.errorMessage = error.message
    payload.errorName = error.name
    payload.stack = error.stack
  } else {
    payload.error = error
  }

  console.error(`[resend] ${operation} failed:`, payload)
}

function logSendAttempt(
  operation: string,
  details: { from: string; to: string | string[]; subject: string; replyTo?: string },
): void {
  console.info(`[resend] ${operation} attempt:`, {
    from: details.from,
    fromAddress: extractEmailAddress(details.from),
    to: details.to,
    subject: details.subject,
    replyTo: details.replyTo ?? null,
    sandboxFrom: isResendSandboxFromAddress(details.from),
  })
}

function buildFallbackHtml(subject: string): string {
  const escaped = subject
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<!DOCTYPE html><html><body><p>${escaped}</p><p>Bags of Groceries Tasmania</p></body></html>`
}

async function renderEmailHtml(
  react: ReactElement,
  subject: string,
): Promise<{ html: string; text: string; usedFallback: boolean }> {
  try {
    const html = await render(react)
    if (!html?.trim()) {
      throw new Error('@react-email/render returned empty HTML')
    }
    const text = subject
    return { html, text, usedFallback: false }
  } catch (err) {
    console.error('[resend] @react-email/render failed — using plain html/text fallback:', {
      subject,
      error: err instanceof Error ? err.message : err,
      stack: err instanceof Error ? err.stack : undefined,
    })
    return {
      html: buildFallbackHtml(subject),
      text: subject,
      usedFallback: true,
    }
  }
}

type SendPayload = {
  from: string
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

async function sendViaResend(
  operation: string,
  payload: SendPayload,
): Promise<{ id?: string }> {
  const fromCandidates = [
    payload.from,
    ...(payload.from !== getFromEmailAddressOnly()
      ? [getFromEmailAddressOnly()]
      : []),
  ]

  let lastError: ResendApiError | null = null

  for (const from of fromCandidates) {
    logSendAttempt(operation, {
      from,
      to: payload.to,
      subject: payload.subject,
      replyTo: payload.replyTo,
    })

    const { data, error } = await getResend().emails.send({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
    })

    if (!error) {
      console.info(`[resend] ${operation} accepted by Resend:`, {
        id: data?.id ?? null,
        from,
        to: payload.to,
        subject: payload.subject,
      })
      return { id: data?.id }
    }

    lastError = error

    if (
      error.name === 'invalid_from_address' &&
      from !== fromCandidates[fromCandidates.length - 1]
    ) {
      console.warn(`[resend] ${operation} retrying with bare from address:`, {
        rejectedFrom: from,
        retryFrom: getFromEmailAddressOnly(),
        error: error.message,
      })
      continue
    }

    break
  }

  const message = formatResendApiError(lastError!)
  logResendFailure(
    operation,
    {
      to: payload.to,
      subject: payload.subject,
      from: payload.from,
      replyTo: payload.replyTo ?? null,
    },
    lastError,
  )
  throw new Error(message)
}

export async function sendEmail(options: {
  to: string | string[]
  subject: string
  react: ReactElement
}): Promise<SendEmailResult> {
  assertResendConfig('sendEmail')
  warnSandboxRecipientMismatch(options.to)

  const from = getFromEmail()
  const { html, text } = await renderEmailHtml(options.react, options.subject)

  const { id } = await sendViaResend('sendEmail', {
    from,
    to: options.to,
    subject: options.subject,
    html,
    text,
  })

  return { ok: true, id }
}

export async function sendAdminNotification(options: {
  subject: string
  react: ReactElement
  replyTo?: string
}): Promise<SendEmailResult> {
  const recipients = getAdminNotifyEmails()
  if (recipients.length === 0) {
    console.warn(
      '[resend] ADMIN_NOTIFY_EMAIL not set — skipping admin notification',
    )
    return { ok: false, error: 'ADMIN_NOTIFY_EMAIL not configured' }
  }

  assertResendConfig('sendAdminNotification')
  warnSandboxRecipientMismatch(recipients)

  const from = getFromEmail()
  const { html, text } = await renderEmailHtml(options.react, options.subject)

  const { id } = await sendViaResend('sendAdminNotification', {
    from,
    to: recipients,
    subject: options.subject,
    html,
    text,
    replyTo: options.replyTo,
  })

  return { ok: true, id }
}

/** Used by scripts/test-resend.mjs — send a plain test message without React templates. */
export async function sendTestEmail(options: {
  to: string
  subject?: string
}): Promise<SendEmailResult> {
  assertResendConfig('sendTestEmail')
  warnSandboxRecipientMismatch(options.to)

  const from = getFromEmail()
  const subject = options.subject ?? 'Resend test — Bags of Groceries Tasmania'
  const html = buildFallbackHtml(
    'This is a test email from Bags of Groceries Tasmania. If you received this, Resend is configured correctly.',
  )
  const text =
    'This is a test email from Bags of Groceries Tasmania. If you received this, Resend is configured correctly.'

  const { id } = await sendViaResend('sendTestEmail', {
    from,
    to: options.to,
    subject,
    html,
    text,
  })

  return { ok: true, id }
}
