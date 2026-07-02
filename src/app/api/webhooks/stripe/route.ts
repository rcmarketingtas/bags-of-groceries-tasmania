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

const CHECKOUT_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
])

const RECORDABLE_PAYMENT_STATUSES = new Set(['paid', 'no_payment_required'])

function logStep(
  step: string,
  details: Record<string, unknown>,
): void {
  console.error(`[stripe-webhook] ${step}`, details)
}

function splitCustomerName(name: string | null | undefined): {
  firstName: string
  lastName: string
} {
  const trimmed = name?.trim() ?? ''
  if (!trimmed) return { firstName: '', lastName: '' }

  const parts = trimmed.split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

function deriveBagsFromLineItems(session: Stripe.Checkout.Session): number {
  const lineItems = session.line_items?.data
  if (!lineItems?.length) return 1

  const total = lineItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  return total > 0 ? total : 1
}

async function resolveDonationFields(
  session: Stripe.Checkout.Session,
): Promise<{
  firstName: string
  lastName: string
  email: string
  message: string | null
  bags: number
} | null> {
  const meta = session.metadata ?? {}
  const customerName = splitCustomerName(session.customer_details?.name)

  const email =
    meta.email?.trim() ||
    session.customer_email?.trim() ||
    session.customer_details?.email?.trim() ||
    ''

  const firstName = meta.first_name?.trim() || customerName.firstName
  const lastName = meta.last_name?.trim() || customerName.lastName

  const bagsMeta = meta.bags?.trim()
  let bags: number

  if (bagsMeta === '0') {
    bags = 0
  } else {
    const bagsRaw = parseInt(bagsMeta ?? '', 10)
    if (Number.isFinite(bagsRaw) && bagsRaw > 0) {
      bags = bagsRaw
    } else if (meta.donation_type === 'contribution') {
      bags = 0
    } else {
      bags = deriveBagsFromLineItems(session)
      if (bags <= 0) {
        try {
          const expanded = await getStripe().checkout.sessions.retrieve(session.id, {
            expand: ['line_items'],
          })
          bags = deriveBagsFromLineItems(expanded)
        } catch (err) {
          logStep('failed to retrieve session line_items for bag count', {
            sessionId: session.id,
            message: err instanceof Error ? err.message : String(err),
          })
          bags = Math.max(bags, 1)
        }
      }
    }
  }

  if (!email || !firstName || !lastName) {
    logStep('missing required donor fields', {
      sessionId: session.id,
      hasEmail: Boolean(email),
      hasFirstName: Boolean(firstName),
      hasLastName: Boolean(lastName),
      metadataKeys: Object.keys(meta),
      customerEmail: session.customer_email,
      customerDetailsEmail: session.customer_details?.email,
    })
    return null
  }

  return {
    firstName,
    lastName,
    email: email.toLowerCase(),
    message: meta.message?.trim() || null,
    bags,
  }
}

function shouldRecordDonation(session: Stripe.Checkout.Session): boolean {
  if (session.status !== 'complete') {
    return false
  }

  return RECORDABLE_PAYMENT_STATUSES.has(session.payment_status)
}

async function recordDonationFromSession(
  session: Stripe.Checkout.Session,
): Promise<NextResponse> {
  logStep('processing checkout session', {
    sessionId: session.id,
    eventPaymentStatus: session.payment_status,
    eventStatus: session.status,
    customerEmail: session.customer_email,
    metadataKeys: session.metadata ? Object.keys(session.metadata) : [],
  })

  if (!shouldRecordDonation(session)) {
    logStep('skipping insert — session not complete or payment not recordable', {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
      allowedPaymentStatuses: Array.from(RECORDABLE_PAYMENT_STATUSES),
    })
    return NextResponse.json({
      received: true,
      skipped: 'payment_status_not_recordable',
      paymentStatus: session.payment_status,
      status: session.status,
    })
  }

  const donor = await resolveDonationFields(session)
  if (!donor) {
    return NextResponse.json(
      {
        error: 'Checkout session missing required donor fields',
        step: 'donor_validation',
        sessionId: session.id,
      },
      { status: 422 },
    )
  }

  // Checkout Session ID is always present and unique — stable idempotency key.
  const stripePaymentId = session.id
  const legacyPaymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : null
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

  if (legacyPaymentIntentId) {
    const { data: legacyRow } = await supabase
      .from('donations')
      .select('id')
      .eq('stripe_payment_id', legacyPaymentIntentId)
      .maybeSingle()

    if (legacyRow) {
      logStep('donation already recorded (legacy payment_intent id)', {
        sessionId: session.id,
        legacyPaymentIntentId,
        email: donor.email,
      })
      return NextResponse.json({
        received: true,
        sessionId: session.id,
        donationRecorded: true,
        duplicate: true,
        legacyPaymentIntentId,
      })
    }
  }

  const { error: dbError } = await supabase.from('donations').insert({
    first_name: donor.firstName,
    last_name: donor.lastName,
    email: donor.email,
    amount: session.amount_total ?? 0,
    bags: donor.bags,
    message: donor.message,
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
      email: donor.email,
    })
  } else {
    logStep('donation inserted', {
      sessionId: session.id,
      stripePaymentId,
      email: donor.email,
      bags: donor.bags,
      amountCents: session.amount_total ?? 0,
    })
    revalidatePath('/')
    revalidatePath('/sponsor')
  }

  assertResendConfig('stripe webhook')

  try {
    await sendEmail({
      to: donor.email,
      subject: 'Thank you for your donation — Bags of Groceries Tasmania',
      react: createElement(DonationReceiptEmail, {
        firstName: donor.firstName,
        bags: donor.bags,
        amount,
      }),
    })
  } catch (emailErr) {
    logStep('donor receipt email failed (donation saved)', {
      sessionId: session.id,
      stripePaymentId,
      recipient: donor.email,
      isDuplicateDonation,
      message: emailErr instanceof Error ? emailErr.message : String(emailErr),
    })
  }

  if (!isDuplicateDonation) {
    try {
      await sendAdminNotification({
        subject:
        donor.bags > 0
          ? `New donation: ${donor.bags} bag${donor.bags !== 1 ? 's' : ''} from ${donor.firstName} ${donor.lastName}`
          : `New $${amount.toFixed(0)} contribution from ${donor.firstName} ${donor.lastName}`,
        react: createElement(AdminNewDonationEmail, {
          firstName: donor.firstName,
          lastName: donor.lastName,
          email: donor.email,
          bags: donor.bags,
          amount,
          message: donor.message || undefined,
        }),
        replyTo: donor.email,
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

export async function POST(request: NextRequest) {
  assertWebhookEnv('POST /api/webhooks/stripe')

  const configErrors = getWebhookEnvErrors()
  if (configErrors.length > 0) {
    logStep('configuration incomplete — cannot process webhook', {
      errors: configErrors,
    })
    return NextResponse.json(
      { error: 'Webhook handler misconfigured', step: 'env_check', errors: configErrors },
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

  if (!CHECKOUT_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type })
  }

  const session = event.data.object as Stripe.Checkout.Session
  return recordDonationFromSession(session)
}
