import { NextResponse } from 'next/server'
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
    env.supabaseServiceRoleKey

  return NextResponse.json({
    ok: ready,
    webhookPath: '/api/webhooks/stripe',
    requiredEvent: 'checkout.session.completed',
    env,
    notes: [
      'STRIPE_WEBHOOK_SECRET must match the signing secret from the Stripe endpoint (test vs live).',
      'Resend vars are optional for DB insert but required for receipt emails.',
    ],
  })
}
