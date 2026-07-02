import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTotalBagsDelivered } from '@/lib/donations'
import { getWebhookEnvStatus } from '@/lib/webhook-config'

export const dynamic = 'force-dynamic'

/** Quick diagnostic — booleans only, no secret values. */
export async function GET() {
  const env = getWebhookEnvStatus()
  const ready =
    env.stripeSecretKey &&
    env.stripeWebhookSecret &&
    env.stripeWebhookSecretFormat &&
    env.supabaseUrl &&
    env.supabaseServiceRoleKey &&
    env.supabaseServiceRoleKeyFormat

  let db: {
    ok: boolean
    donationCount?: number
    totalBags?: number
    error?: string
    code?: string
  } = { ok: false }

  if (env.supabaseServiceRoleKey && env.supabaseServiceRoleKeyFormat) {
    try {
      const supabase = createAdminClient()
      const { count, error } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })

      if (error) {
        db = { ok: false, error: error.message, code: error.code }
      } else {
        const totalBags = await getTotalBagsDelivered()
        db = { ok: true, donationCount: count ?? 0, totalBags }
      }
    } catch (err) {
      db = {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  } else {
    db = {
      ok: false,
      error: 'Supabase service role key missing or invalid — cannot query donations',
    }
  }

  return NextResponse.json({
    ok: ready && db.ok,
    webhookPath: '/api/webhooks/stripe',
    requiredEvents: ['checkout.session.completed', 'checkout.session.async_payment_succeeded'],
    env,
    db,
    notes: [
      'STRIPE_WEBHOOK_SECRET must match the signing secret from the Stripe endpoint (test vs live).',
      'SUPABASE_SERVICE_ROLE_KEY must be the service_role JWT, not the anon key.',
      'Resend vars are optional for DB insert but required for receipt emails.',
    ],
  })
}
