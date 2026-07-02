import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseServiceRoleKey } from '@/lib/supabase/jwt-role'

const LEADERBOARD_DEFAULT_LIMIT = 15
const LEADERBOARD_FETCH_BATCH = 100

export interface LeaderboardEntry {
  displayName: string
  bags: number
  amountCents: number
  lastDonationAt: string
}

/** Public display name — first name plus last initial only. */
export function formatDonorDisplayName(firstName: string, lastName: string): string {
  const first = firstName.trim()
  const last = lastName.trim()
  if (!first) return 'Anonymous'
  const initial = last.charAt(0).toUpperCase()
  return initial ? `${first} ${initial}.` : first
}

export function formatContributionLabel(amountCents: number): string {
  const dollars = amountCents / 100
  return dollars % 1 === 0 ? `$${dollars.toFixed(0)} contributed` : `$${dollars.toFixed(2)} contributed`
}

function logDonationsReadError(context: string, error: { message: string; code?: string; hint?: string }): void {
  const roleHint = !isSupabaseServiceRoleKey(process.env.SUPABASE_SERVICE_ROLE_KEY)
    ? 'SUPABASE_SERVICE_ROLE_KEY may be the anon key — donations table RLS blocks anon reads'
    : undefined

  console.error(`[donations] ${context}:`, {
    message: error.message,
    code: error.code,
    hint: error.hint ?? roleHint,
  })
}

/** Sum of all `bags` in donations — live from Supabase on every request. */
export async function getTotalBagsDelivered(): Promise<number> {
  noStore()

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('donations').select('bags')

    if (error) {
      logDonationsReadError('Failed to fetch donation bag total', error)
      return 0
    }

    if (!data) return 0
    return data.reduce((sum, row) => sum + (row.bags ?? 0), 0)
  } catch (err) {
    console.error('[donations] Failed to fetch donation bag total:', err)
    return 0
  }
}

export type LeaderboardSort = 'recent' | 'top'

/**
 * Donors for the public leaderboard.
 * `recent`: individual donations, most recent first.
 * `top`: aggregated by email, highest total bags first.
 */
export async function getLeaderboardDonations(
  limit = LEADERBOARD_DEFAULT_LIMIT,
  sort: LeaderboardSort = 'recent',
): Promise<LeaderboardEntry[]> {
  noStore()

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('donations')
      .select('first_name, last_name, email, bags, amount, created_at')
      .order('created_at', { ascending: false })
      .limit(LEADERBOARD_FETCH_BATCH)

    if (error) {
      logDonationsReadError('Failed to fetch leaderboard donations', error)
      return []
    }

    if (!data) return []

    if (sort === 'recent') {
      return data.slice(0, limit).map((row) => ({
        displayName: formatDonorDisplayName(row.first_name, row.last_name),
        bags: row.bags ?? 0,
        amountCents: row.amount ?? 0,
        lastDonationAt: row.created_at,
      }))
    }

    const byEmail = new Map<
      string,
      { displayName: string; bags: number; amountCents: number; lastDonationAt: string }
    >()

    for (const row of data) {
      const email = row.email.toLowerCase()
      const existing = byEmail.get(email)

      if (existing) {
        existing.bags += row.bags ?? 0
        existing.amountCents += row.amount ?? 0
        if (row.created_at > existing.lastDonationAt) {
          existing.lastDonationAt = row.created_at
        }
      } else {
        byEmail.set(email, {
          displayName: formatDonorDisplayName(row.first_name, row.last_name),
          bags: row.bags ?? 0,
          amountCents: row.amount ?? 0,
          lastDonationAt: row.created_at,
        })
      }
    }

    const entries = Array.from(byEmail.values())
    entries.sort((a, b) => {
      if (b.bags !== a.bags) return b.bags - a.bags
      return (
        new Date(b.lastDonationAt).getTime() -
        new Date(a.lastDonationAt).getTime()
      )
    })

    return entries.slice(0, limit)
  } catch (err) {
    console.error('[donations] Failed to fetch leaderboard donations:', err)
    return []
  }
}
