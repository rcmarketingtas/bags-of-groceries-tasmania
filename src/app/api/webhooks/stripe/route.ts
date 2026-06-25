import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createElement } from 'react'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  ResendSandboxError,
  assertResendConfig,
  sendAdminNotification,
  sendEmail,
} from '@/lib/resend'
import DonationReceiptEmail from '@/emails/donation-receipt'
import AdminNewDonationEmail from '@/emails/admin-new-donation'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 },
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const meta = session.metadata
    if (!meta?.email) {
      console.error('Missing metadata on Stripe session:', session.id)
      return NextResponse.json({ received: true })
    }

    const supabase = createAdminClient()
    const stripePaymentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.id
    const bags = parseInt(meta.bags ?? '1', 10)
    const amount = (session.amount_total ?? 0) / 100

    const { error: dbError } = await supabase.from('donations').insert({
      first_name: meta.first_name,
      last_name: meta.last_name,
      email: meta.email,
      amount: session.amount_total ?? 0,
      bags,
      message: meta.message || null,
      stripe_payment_id: stripePaymentId,
    })

    const isDuplicateDonation = dbError?.code === '23505'

    if (dbError && !isDuplicateDonation) {
      console.error('DB insert error:', {
        sessionId: session.id,
        stripePaymentId,
        code: dbError.code,
        message: dbError.message,
      })
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (isDuplicateDonation) {
      console.info('Donation already recorded; sending receipt email anyway', {
        sessionId: session.id,
        stripePaymentId,
        email: meta.email,
      })
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
      console.error('Donor receipt email failed (donation saved):', {
        sessionId: session.id,
        stripePaymentId,
        recipient: meta.email,
        isDuplicateDonation,
        sandboxBlocked: emailErr instanceof ResendSandboxError,
        message: emailErr instanceof Error ? emailErr.message : String(emailErr),
      })
      return NextResponse.json(
        { error: 'Donor receipt email failed' },
        { status: 500 },
      )
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
        // Donation is recorded and donor got a receipt — do not fail the webhook.
        console.error('Admin donation notification failed (donation saved):', {
          sessionId: session.id,
          stripePaymentId,
          message: emailErr instanceof Error ? emailErr.message : String(emailErr),
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
