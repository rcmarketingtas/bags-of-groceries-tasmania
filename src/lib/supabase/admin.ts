import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client — bypasses RLS.
 * Use only in trusted server contexts (webhooks, cron jobs).
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not configured — cannot connect to Supabase',
    )
  }
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured — webhook inserts will fail',
    )
  }

  return createClient(url, serviceRoleKey)
}
