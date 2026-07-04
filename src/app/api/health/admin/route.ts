import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseServiceRoleKey } from '@/lib/supabase/jwt-role'

export const dynamic = 'force-dynamic'

function supabaseProjectRef(url: string | undefined): string | null {
  if (!url) return null
  try {
    const host = new URL(url).hostname
    const ref = host.split('.')[0]
    return ref || null
  } catch {
    return null
  }
}

/** Diagnostic — confirms Supabase env matches a project that has your tables. */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  const env = {
    supabaseUrlSet: Boolean(supabaseUrl),
    supabaseProjectRef: supabaseProjectRef(supabaseUrl),
    anonKeySet: Boolean(anonKey),
    serviceRoleKeySet: Boolean(serviceRoleKey),
    serviceRoleKeyFormat: isSupabaseServiceRoleKey(serviceRoleKey),
  }

  let db: {
    ok: boolean
    applicationsCount?: number
    donationsCount?: number
    error?: string
  } = { ok: false }

  if (env.serviceRoleKeySet && env.serviceRoleKeyFormat) {
    try {
      const supabase = createAdminClient()
      const [apps, donations] = await Promise.all([
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('donations').select('*', { count: 'exact', head: true }),
      ])

      if (apps.error || donations.error) {
        db = {
          ok: false,
          error: apps.error?.message ?? donations.error?.message ?? 'Query failed',
        }
      } else {
        db = {
          ok: true,
          applicationsCount: apps.count ?? 0,
          donationsCount: donations.count ?? 0,
        }
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
      error: 'SUPABASE_SERVICE_ROLE_KEY missing or not a service_role JWT',
    }
  }

  return NextResponse.json({
    ok:
      env.supabaseUrlSet &&
      env.anonKeySet &&
      env.serviceRoleKeyFormat &&
      db.ok,
    env,
    db,
    adminLoginNotes: [
      'Create admin users in this Supabase project: Authentication → Users → Add user.',
      'Enable Auto Confirm User when creating the account.',
      'Use the same project as NEXT_PUBLIC_SUPABASE_URL in Vercel.',
      'Admin login: /admin/login',
    ],
  })
}
