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

type DonorFields = {
  firstName: string
  lastName: string
  email: string
  message: string | null
  bags: number
}

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

function parseBagsFromMetadata(
  meta: Stripe.Metadata,
  fallback: number,
): number {
  const bagsMeta = meta.bags?.trim()
  if (bagsMeta === '0') return 0

  const bagsRaw = parseInt(bagsMeta ?? '', 10)
  if (Number.isFinite(bagsRaw) && bagsRaw >= 0) {
    return bagsRaw
  }

  if (meta.donation_type === 'contribution') {
    return 0
  }

  return fallback
}

function resolveDonorFromMetadata(
  meta: Stripe.Metadata,
  emailFallback: string,
  nameFallback?: { firstName: string; lastName: string },
): DonorFields | null {
  const customerName = nameFallback ?? { firstName: '', lastName: '' }

  const email =
    meta.email?.trim() ||
    emailFallback.trim() ||
    ''

  const firstName = meta.first_name?.trim() || customerName.firstName
  const lastName = meta.last_name?.trim() || customerName.lastName
  const bags = parseBagsFromMetadata(meta, meta.donation_type === 'contribution' ? 0 : 1)

  if (!email || !firstName || !lastName) {
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

async function resolveDonationFields(
  session: Stripe.Checkout.Session,
): Promise<DonorFields | null> {
  const meta = session.metadata ?? {}
  const customerName = splitCustomerName(session.customer_details?.name)

  const emailFallback =
    session.customer_email?.trim() ||
    session.customer_details?.email?.trim() ||
    ''

  let donor = resolveDonorFromMetadata(meta, emailFallback, customerName)

  if (!donor) {
    logStep('missing required donor fields', {
      sessionId: session.id,
      metadataKeys: Object.keys(meta),
      customerEmail: session.customer_email,
      customerDetailsEmail: session.customer_details?.email,
    })
    return null
  }

  if (donor.bags <= 0 && meta.donation_type !== 'contribution' && meta.bags?.trim() !== '0') {
    let bags = deriveBagsFromLineItems(session)
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
        bags = 1
      }
    }
    donor = { ...donor, bags }
  }

  return donor
}

async function resolveDonationFieldsFromInvoice(
  invoice: Stripe.Invoice,
): Promise<DonorFields | null> {
  const subscriptionId =
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id

  if (!subscriptionId) {
    logStep('invoice.paid missing subscription id', {
      invoiceId: invoice.id,
    })
    return null
  }

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
  const meta = subscription.metadata ?? {}

  const emailFallback = invoice.customer_email?.trim() ?? ''

  const donor = resolveDonorFromMetadata(meta, emailFallback)
  if (!donor) {
    logStep('missing required donor fields on subscription metadata', {
      invoiceId: invoice.id,
      subscriptionId,
      metadataKeys: Object.keys(meta),
      customerEmail: invoice.customer_email,
    })
    return null
  }

  return donor
}

function shouldRecordDonation(session: Stripe.Checkout.Session): boolean {
  if (session.status !== 'complete') {
    return false
  }

  return RECORDABLE_PAYMENT_STATUSES.has(session.payment_status)
}

async function persistDonationAndNotify({
  donor,
  amountCents,
  stripePaymentId,
  isRecurring,
  sourceId,
}: {
  donor: DonorFields
  amountCents: number
  stripePaymentId: string
  isRecurring: boolean
  sourceId: string
}): Promise<NextResponse> {
  const amount = amountCents / 100

  let supabase
  try {
    supabase = createAdminClient()
  } catch (err) {
    logStep('supabase admin client failed', {
      sourceId,
      message: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { error: 'Supabase not configured', step: 'supabase_client' },
      { status: 500 },
    )
  }

  const { error: dbError } = await supabase.from('donations').insert({
    first_name: donor.firstName,
    last_name: donor.lastName,
    email: donor.email,
    amount: amountCents,
    bags: donor.bags,
    message: donor.message,
    stripe_payment_id: stripePaymentId,
  })

  const isDuplicateDonation = dbError?.code === '23505'

  if (dbError && !isDuplicateDonation) {
    logStep('donations insert failed', {
      sourceId,
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
        sourceId,
        code: dbError.code,
      },
      { status: 500 },
    )
  }

  if (isDuplicateDonation) {
    logStep('donation already recorded (duplicate stripe_payment_id)', {
      sourceId,
      stripePaymentId,
      email: donor.email,
    })
  } else {
    logStep('donation inserted', {
      sourceId,
      stripePaymentId,
      email: donor.email,
      bags: donor.bags,
      amountCents,
      isRecurring,
    })
    revalidatePath('/')
    revalidatePath('/sponsor')
  }

  assertResendConfig('stripe webhook')

  const receiptSubject = isRecurring
    ? 'Thank you for your monthly gift — Bags of Groceries Tasmania'
    : 'Thank you for your donation — Bags of Groceries Tasmania'

  try {
    await sendEmail({
      to: donor.email,
      subject: receiptSubject,
      react: createElement(DonationReceiptEmail, {
        firstName: donor.firstName,
        bags: donor.bags,
        amount,
        isRecurring,
      }),
    })
  } catch (emailErr) {
    logStep('donor receipt email failed (donation saved)', {
      sourceId,
      stripePaymentId,
      recipient: donor.email,
      isDuplicateDonation,
      message: emailErr instanceof Error ? emailErr.message : String(emailErr),
    })
  }

  if (!isDuplicateDonation) {
    const adminSubject = isRecurring
      ? donor.bags > 0
        ? `New monthly donation: ${donor.bags} bag${donor.bags !== 1 ? 's' : ''} from ${donor.firstName} ${donor.lastName}`
        : `New monthly $${amount.toFixed(0)} contribution from ${donor.firstName} ${donor.lastName}`
      : donor.bags > 0
        ? `New donation: ${donor.bags} bag${donor.bags !== 1 ? 's' : ''} from ${donor.firstName} ${donor.lastName}`
        : `New $${amount.toFixed(0)} contribution from ${donor.firstName} ${donor.lastName}`

    try {
      await sendAdminNotification({
        subject: adminSubject,
        react: createElement(AdminNewDonationEmail, {
          firstName: donor.firstName,
          lastName: donor.lastName,
          email: donor.email,
          bags: donor.bags,
          amount,
          message: donor.message || undefined,
          isRecurring,
        }),
        replyTo: donor.email,
      })
    } catch (emailErr) {
      logStep('admin donation notification failed (donation saved)', {
        sourceId,
        stripePaymentId,
        message: emailErr instanceof Error ? emailErr.message : String(emailErr),
      })
    }
  }

  return NextResponse.json({
    received: true,
    sourceId,
    donationRecorded: true,
    duplicate: isDuplicateDonation,
    isRecurring,
  })
}

async function recordDonationFromSession(
  session: Stripe.Checkout.Session,
): Promise<NextResponse> {
  logStep('processing checkout session', {
    sessionId: session.id,
    mode: session.mode,
    eventPaymentStatus: session.payment_status,
    eventStatus: session.status,
    customerEmail: session.customer_email,
    metadataKeys: session.metadata ? Object.keys(session.metadata) : [],
  })

  if (session.mode === 'subscription') {
    logStep('skipping insert — subscription checkout handled by invoice.paid', {
      sessionId: session.id,
    })
    return NextResponse.json({
      received: true,
      skipped: 'subscription_checkout',
      sessionId: session.id,
    })
  }

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

  const stripePaymentId = session.id
  const legacyPaymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : null

  if (legacyPaymentIntentId) {
    let supabase
    try {
      supabase = createAdminClient()
    } catch {
      supabase = null
    }

    if (supabase) {
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
  }

  return persistDonationAndNotify({
    donor,
    amountCents: session.amount_total ?? 0,
    stripePaymentId,
    isRecurring: false,
    sourceId: session.id,
  })
}

async function recordDonationFromInvoice(
  invoice: Stripe.Invoice,
): Promise<NextResponse> {
  logStep('processing invoice.paid', {
    invoiceId: invoice.id,
    subscriptionId:
      typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id,
    amountPaid: invoice.amount_paid,
    status: invoice.status,
  })

  if (invoice.status !== 'paid' || invoice.amount_paid <= 0) {
    return NextResponse.json({
      received: true,
      skipped: 'invoice_not_paid',
      invoiceId: invoice.id,
    })
  }

  const donor = await resolveDonationFieldsFromInvoice(invoice)
  if (!donor) {
    return NextResponse.json(
      {
        error: 'Invoice missing required donor fields',
        step: 'donor_validation',
        invoiceId: invoice.id,
      },
      { status: 422 },
    )
  }

  return persistDonationAndNotify({
    donor,
    amountCents: invoice.amount_paid,
    stripePaymentId: invoice.id,
    isRecurring: true,
    sourceId: invoice.id,
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

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    return recordDonationFromInvoice(invoice)
  }

  if (!CHECKOUT_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type })
  }

  const session = event.data.object as Stripe.Checkout.Session
  return recordDonationFromSession(session)
}
