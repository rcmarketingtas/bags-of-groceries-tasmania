import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createElement } from 'react'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend, FROM_EMAIL } from '@/lib/resend'
import DonationReceiptEmail from '@/emails/donation-receipt'

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

    const { error: dbError } = await supabase.from('donations').insert({
      first_name: meta.first_name,
      last_name: meta.last_name,
      email: meta.email,
      amount: session.amount_total ?? 0,
      bags: parseInt(meta.bags ?? '1', 10),
      message: meta.message || null,
      stripe_payment_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.id,
    })

    if (dbError) {
      // Avoid duplicate key errors on retried webhooks
      if (dbError.code === '23505') {
        return NextResponse.json({ received: true })
      }
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: meta.email,
        subject:
          'Thank you for your donation — Bags of Groceries Tasmania',
        react: createElement(DonationReceiptEmail, {
          firstName: meta.first_name,
          bags: parseInt(meta.bags ?? '1', 10),
          amount: (session.amount_total ?? 0) / 100,
        }),
      })
    } catch (emailErr) {
      console.error('Email send error:', emailErr)
    }
  }

  return NextResponse.json({ received: true })
}
