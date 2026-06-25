/** Boolean-only env checks for Stripe webhook → Supabase pipeline diagnostics. */

export type WebhookEnvStatus = {
  stripeSecretKey: boolean
  stripeWebhookSecret: boolean
  stripeWebhookSecretFormat: boolean
  supabaseUrl: boolean
  supabaseServiceRoleKey: boolean
  resendApiKey: boolean
  resendFromEmail: boolean
  adminNotifyEmail: boolean
}

export function getWebhookEnvStatus(): WebhookEnvStatus {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? ''

  return {
    stripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY?.startsWith('sk_')),
    stripeWebhookSecret: Boolean(webhookSecret),
    stripeWebhookSecretFormat: webhookSecret.startsWith('whsec_'),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://')),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resendApiKey: Boolean(process.env.RESEND_API_KEY?.startsWith('re_')),
    resendFromEmail: Boolean(process.env.RESEND_FROM_EMAIL),
    adminNotifyEmail: Boolean(process.env.ADMIN_NOTIFY_EMAIL?.trim()),
  }
}

export function getWebhookEnvErrors(): string[] {
  const status = getWebhookEnvStatus()
  const errors: string[] = []

  if (!status.stripeSecretKey) {
    errors.push('STRIPE_SECRET_KEY is missing or invalid (must start with sk_)')
  }
  if (!status.stripeWebhookSecret) {
    errors.push('STRIPE_WEBHOOK_SECRET is missing')
  } else if (!status.stripeWebhookSecretFormat) {
    errors.push('STRIPE_WEBHOOK_SECRET must start with whsec_')
  }
  if (!status.supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is missing or invalid')
  }
  if (!status.supabaseServiceRoleKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is missing')
  }

  return errors
}

export function assertWebhookEnv(context: string): void {
  const errors = getWebhookEnvErrors()
  if (errors.length > 0) {
    console.error(`[stripe-webhook] ${context} — missing configuration:`, errors)
  }
}
