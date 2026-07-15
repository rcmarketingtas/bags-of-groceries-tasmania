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

function deriveBagsFromInvoiceLines(invoice: Stripe.Invoice): number {
  const lines = invoice.lines?.data ?? []
  const total = lines.reduce((sum, line) => sum + (line.quantity ?? 0), 0)
  return total > 0 ? total : 1
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  if (typeof invoice.subscription === 'string') {
    return invoice.subscription
  }
  if (invoice.subscription?.id) {
    return invoice.subscription.id
  }
  return null
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

function mergeMetadata(
  ...sources: Array<Stripe.Metadata | null | undefined>
): Stripe.Metadata {
  const merged: Stripe.Metadata = {}
  for (const source of sources) {
    if (!source) continue
    for (const [key, value] of Object.entries(source)) {
      if (value?.trim()) {
        merged[key] = value
      }
    }
  }
  return merged
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
  const lastName =
    meta.last_name?.trim() ||
    customerName.lastName ||
    (firstName ? 'Supporter' : '')
  const bags = parseBagsFromMetadata(meta, meta.donation_type === 'contribution' ? 0 : 1)

  if (!email || !firstName) {
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
  const subscriptionId = getInvoiceSubscriptionId(invoice)

  let subscriptionMeta: Stripe.Metadata = {}
  let checkoutSessionMeta: Stripe.Metadata = {}
  let checkoutCustomerName: { firstName: string; lastName: string } | undefined
  let checkoutEmail = ''

  if (subscriptionId) {
    try {
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
      subscriptionMeta = subscription.metadata ?? {}

      const sessions = await getStripe().checkout.sessions.list({
        subscription: subscriptionId,
        limit: 1,
      })
      const session = sessions.data[0]
      if (session) {
        checkoutSessionMeta = session.metadata ?? {}
        checkoutCustomerName = splitCustomerName(session.customer_details?.name)
        checkoutEmail =
          session.customer_email?.trim() ||
          session.customer_details?.email?.trim() ||
          ''
      }
    } catch (err) {
      logStep('failed to load subscription or checkout session for invoice', {
        invoiceId: invoice.id,
        subscriptionId,
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const meta = mergeMetadata(
    checkoutSessionMeta,
    subscriptionMeta,
    invoice.subscription_details?.metadata,
  )

  let customer: Stripe.Customer | Stripe.DeletedCustomer | null =
    typeof invoice.customer === 'object' ? invoice.customer : null

  if (!customer && typeof invoice.customer === 'string') {
    try {
      customer = await getStripe().customers.retrieve(invoice.customer)
    } catch (err) {
      logStep('failed to retrieve customer for invoice', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const activeCustomer =
    customer && !customer.deleted ? customer : null

  const emailFallback =
    checkoutEmail ||
    invoice.customer_email?.trim() ||
    activeCustomer?.email?.trim() ||
    ''

  const nameFallback =
    checkoutCustomerName ?? splitCustomerName(activeCustomer?.name)

  let donor = resolveDonorFromMetadata(meta, emailFallback, nameFallback)

  if (!donor) {
    logStep('missing required donor fields on subscription metadata', {
      invoiceId: invoice.id,
      subscriptionId,
      metadataKeys: Object.keys(meta),
      checkoutMetadataKeys: Object.keys(checkoutSessionMeta),
      subscriptionMetadataKeys: Object.keys(subscriptionMeta),
      customerEmail: invoice.customer_email,
    })
    return null
  }

  if (
    donor.bags <= 0 &&
    meta.donation_type !== 'contribution' &&
    meta.bags?.trim() !== '0'
  ) {
    donor = { ...donor, bags: deriveBagsFromInvoiceLines(invoice) }
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

  if (!isDuplicateDonation) {
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
        message: emailErr instanceof Error ? emailErr.message : String(emailErr),
      })
    }
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
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

    if (!subscriptionId) {
      logStep('subscription checkout missing subscription id', {
        sessionId: session.id,
      })
      return NextResponse.json({
        received: true,
        skipped: 'subscription_no_id',
        sessionId: session.id,
      })
    }

    try {
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice'],
      })
      const latestInvoice = subscription.latest_invoice

      if (
        latestInvoice &&
        typeof latestInvoice === 'object' &&
        latestInvoice.status === 'paid' &&
        latestInvoice.amount_paid > 0
      ) {
        logStep('processing subscription checkout via latest invoice', {
          sessionId: session.id,
          invoiceId: latestInvoice.id,
          subscriptionId,
        })
        return recordDonationFromInvoice(latestInvoice)
      }
    } catch (err) {
      logStep('failed to process subscription checkout via latest invoice', {
        sessionId: session.id,
        subscriptionId,
        message: err instanceof Error ? err.message : String(err),
      })
    }

    logStep('subscription checkout awaiting invoice.paid', {
      sessionId: session.id,
      subscriptionId,
    })
    return NextResponse.json({
      received: true,
      skipped: 'subscription_awaiting_invoice',
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
  const invoiceId = invoice.id

  let fullInvoice = invoice
  try {
    fullInvoice = await getStripe().invoices.retrieve(invoiceId, {
      expand: ['customer', 'lines'],
    })
  } catch (err) {
    logStep('failed to retrieve full invoice — using webhook payload', {
      invoiceId,
      message: err instanceof Error ? err.message : String(err),
    })
  }

  logStep('processing invoice.paid', {
    invoiceId: fullInvoice.id,
    subscriptionId: getInvoiceSubscriptionId(fullInvoice),
    amountPaid: fullInvoice.amount_paid,
    status: fullInvoice.status,
  })

  if (fullInvoice.status !== 'paid' || fullInvoice.amount_paid <= 0) {
    return NextResponse.json({
      received: true,
      skipped: 'invoice_not_paid',
      invoiceId: fullInvoice.id,
    })
  }

  if (!getInvoiceSubscriptionId(fullInvoice)) {
    logStep('invoice.paid missing subscription id', {
      invoiceId: fullInvoice.id,
    })
    return NextResponse.json({
      received: true,
      skipped: 'invoice_not_subscription',
      invoiceId: fullInvoice.id,
    })
  }

  const donor = await resolveDonationFieldsFromInvoice(fullInvoice)
  if (!donor) {
    return NextResponse.json(
      {
        error: 'Invoice missing required donor fields',
        step: 'donor_validation',
        invoiceId: fullInvoice.id,
      },
      { status: 422 },
    )
  }

  return persistDonationAndNotify({
    donor,
    amountCents: fullInvoice.amount_paid,
    stripePaymentId: fullInvoice.id,
    isRecurring: true,
    sourceId: fullInvoice.id,
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
