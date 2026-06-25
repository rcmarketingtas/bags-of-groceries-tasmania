import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createElement } from 'react'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  assertResendConfig,
  sendAdminNotification,
  sendEmail,
} from '@/lib/resend'
import { assertWebhookEnv, getWebhookEnvErrors } from '@/lib/webhook-config'
import DonationReceiptEmail from '@/emails/donation-receipt'
import AdminNewDonationEmail from '@/emails/admin-new-donation'

export const dynamic = 'force-dynamic'

const REQUIRED_METADATA_KEYS = [
  'first_name',
  'last_name',
  'email',
] as const

function logStep(
  step: string,
  details: Record<string, unknown>,
): void {
  console.error(`[stripe-webhook] ${step}`, details)
}

function validateSessionMetadata(
  meta: Stripe.Metadata | null | undefined,
  sessionId: string,
): meta is Stripe.Metadata & {
  first_name: string
  last_name: string
  email: string
} {
  if (!meta) {
    logStep('missing metadata object', { sessionId })
    return false
  }

  const missing = REQUIRED_METADATA_KEYS.filter(
    (key) => !meta[key]?.trim(),
  )

  if (missing.length > 0) {
    logStep('missing required metadata keys', {
      sessionId,
      missing,
      receivedKeys: Object.keys(meta),
    })
    return false
  }

  return true
}

export async function POST(request: NextRequest) {
  assertWebhookEnv('POST /api/webhooks/stripe')

  const configErrors = getWebhookEnvErrors()
  if (configErrors.length > 0) {
    logStep('configuration incomplete — cannot process webhook', {
      errors: configErrors,
    })
    return NextResponse.json(
      { error: 'Webhook handler misconfigured', step: 'env_check' },
      { status: 500 },
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    logStep('missing stripe-signature header', {})
    return NextResponse.json(
      { error: 'Missing stripe-signature header', step: 'signature_header' },
      { status: 400 },
    )
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    logStep('signature verification failed', {
      message: err instanceof Error ? err.message : String(err),
      hint:
        'Check STRIPE_WEBHOOK_SECRET matches the endpoint signing secret (test vs live).',
    })
    return NextResponse.json(
      { error: 'Webhook signature verification failed', step: 'signature_verify' },
      { status: 400 },
    )
  }

  logStep('event received', {
    eventId: event.id,
    eventType: event.type,
  })

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true, ignored: event.type })
  }

  const session = event.data.object as Stripe.Checkout.Session

  logStep('checkout.session.completed', {
    sessionId: session.id,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_email,
    metadataKeys: session.metadata ? Object.keys(session.metadata) : [],
  })

  if (session.payment_status !== 'paid') {
    logStep('skipping insert — payment not paid', {
      sessionId: session.id,
      paymentStatus: session.payment_status,
    })
    return NextResponse.json({
      received: true,
      skipped: 'payment_status_not_paid',
      paymentStatus: session.payment_status,
    })
  }

  const meta = session.metadata
  if (!validateSessionMetadata(meta, session.id)) {
    return NextResponse.json(
      {
        error: 'Checkout session missing required metadata',
        step: 'metadata_validation',
        sessionId: session.id,
        required: REQUIRED_METADATA_KEYS,
      },
      { status: 422 },
    )
  }

  const stripePaymentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.id
  const bags = parseInt(meta.bags ?? '1', 10)
  const amount = (session.amount_total ?? 0) / 100

  let supabase
  try {
    supabase = createAdminClient()
  } catch (err) {
    logStep('supabase admin client failed', {
      sessionId: session.id,
      message: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { error: 'Supabase not configured', step: 'supabase_client' },
      { status: 500 },
    )
  }

  const { error: dbError } = await supabase.from('donations').insert({
    first_name: meta.first_name.trim(),
    last_name: meta.last_name.trim(),
    email: meta.email.trim().toLowerCase(),
    amount: session.amount_total ?? 0,
    bags,
    message: meta.message?.trim() || null,
    stripe_payment_id: stripePaymentId,
  })

  const isDuplicateDonation = dbError?.code === '23505'

  if (dbError && !isDuplicateDonation) {
    logStep('donations insert failed', {
      sessionId: session.id,
      stripePaymentId,
      code: dbError.code,
      message: dbError.message,
      details: dbError.details,
      hint: dbError.hint,
    })
    return NextResponse.json(
      {
        error: 'Failed to insert donation',
        step: 'db_insert',
        sessionId: session.id,
        code: dbError.code,
      },
      { status: 500 },
    )
  }

  if (isDuplicateDonation) {
    logStep('donation already recorded (duplicate stripe_payment_id)', {
      sessionId: session.id,
      stripePaymentId,
      email: meta.email,
    })
  } else {
    logStep('donation inserted', {
      sessionId: session.id,
      stripePaymentId,
      email: meta.email,
      bags,
      amountCents: session.amount_total ?? 0,
    })
    revalidatePath('/')
    revalidatePath('/sponsor')
  }

  assertResendConfig('stripe webhook')

  try {
    await sendEmail({
      to: meta.email,
      subject: 'Thank you for your donation — Bags of Groceries Tasmania',
      react: createElement(DonationReceiptEmail, {
        firstName: meta.first_name,
        bags,
        amount,
      }),
    })
  } catch (emailErr) {
    logStep('donor receipt email failed (donation saved)', {
      sessionId: session.id,
      stripePaymentId,
      recipient: meta.email,
      isDuplicateDonation,
        message: emailErr instanceof Error ? emailErr.message : String(emailErr),
    })
  }

  if (!isDuplicateDonation) {
    try {
      await sendAdminNotification({
        subject: `New donation: ${bags} bag${bags !== 1 ? 's' : ''} from ${meta.first_name} ${meta.last_name}`,
        react: createElement(AdminNewDonationEmail, {
          firstName: meta.first_name,
          lastName: meta.last_name,
          email: meta.email,
          bags,
          amount,
          message: meta.message || undefined,
        }),
        replyTo: meta.email,
      })
    } catch (emailErr) {
      logStep('admin donation notification failed (donation saved)', {
        sessionId: session.id,
        stripePaymentId,
        message: emailErr instanceof Error ? emailErr.message : String(emailErr),
      })
    }
  }

  return NextResponse.json({
    received: true,
    sessionId: session.id,
    donationRecorded: true,
    duplicate: isDuplicateDonation,
  })
}
