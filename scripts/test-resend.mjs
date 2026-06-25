#!/usr/bin/env node
/**
 * Test Resend configuration without running the Next.js app.
 *
 * Usage (from project root):
 *   RESEND_API_KEY=re_... \
 *   RESEND_FROM_EMAIL="Bags of Groceries Tasmania <noreply@bagsofgroceries.org.au>" \
 *   ADMIN_NOTIFY_EMAIL=you@example.com \
 *   node scripts/test-resend.mjs you@example.com
 *
 * Or load from .env.local manually:
 *   export $(grep -v '^#' .env.local | xargs) && node scripts/test-resend.mjs
 */

import { Resend } from 'resend'

function normalizeFromEmail(raw) {
  return raw.trim().replace(/^['"]|['"]$/g, '')
}

function extractEmailAddress(from) {
  const match = from.match(/<([^>]+)>/)
  return (match?.[1] ?? from).trim()
}

const apiKey = process.env.RESEND_API_KEY
const rawFrom =
  process.env.RESEND_FROM_EMAIL ??
  'Bags of Groceries Tasmania <noreply@bagsofgroceries.org.au>'
const from = normalizeFromEmail(rawFrom)
const fromBare = extractEmailAddress(from)
const to = process.argv[2] ?? process.env.TEST_EMAIL_TO ?? process.env.ADMIN_NOTIFY_EMAIL
const subject = 'Resend test — Bags of Groceries Tasmania'

console.log('[test-resend] configuration check:')
console.log('  RESEND_API_KEY:', apiKey ? `${apiKey.slice(0, 8)}...` : '(missing)')
console.log('  RESEND_FROM_EMAIL:', from)
console.log('  bare from address:', fromBare)
console.log('  to:', to ?? '(missing — pass as first arg or set TEST_EMAIL_TO)')

if (!apiKey) {
  console.error('\nERROR: RESEND_API_KEY is not set')
  process.exit(1)
}

if (!to) {
  console.error('\nERROR: provide recipient: node scripts/test-resend.mjs you@example.com')
  process.exit(1)
}

const resend = new Resend(apiKey)
const html =
  '<p>This is a test email from <strong>Bags of Groceries Tasmania</strong>.</p><p>If you received this, Resend is working.</p>'
const text =
  'This is a test email from Bags of Groceries Tasmania. If you received this, Resend is working.'

async function attemptSend(fromAddress) {
  console.log(`\n[test-resend] sending attempt: from=${fromAddress} to=${to} subject="${subject}"`)
  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
    text,
  })
  return { data, error }
}

let result = await attemptSend(from)

if (result.error?.name === 'invalid_from_address' && from !== fromBare) {
  console.warn('[test-resend] display-name from rejected — retrying with bare address:', fromBare)
  result = await attemptSend(fromBare)
}

if (result.error) {
  console.error('\n[test-resend] FAILED:', result.error)
  console.error('\nCheck Resend dashboard → Logs / Emails for this attempt.')
  console.error('Common fixes:')
  console.error('  - Verify domain at https://resend.com/domains')
  console.error('  - RESEND_FROM_EMAIL must use an address on a verified domain')
  console.error('  - Sandbox (*.resend.app) only delivers to your Resend signup email')
  process.exit(1)
}

console.log('\n[test-resend] SUCCESS — Resend id:', result.data?.id)
console.log('Check https://resend.com/emails for delivery status.')
