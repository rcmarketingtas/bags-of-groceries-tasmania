import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const LEADERBOARD_DEFAULT_LIMIT = 15
const LEADERBOARD_FETCH_BATCH = 100

export interface LeaderboardEntry {
  displayName: string
  bags: number
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

/** Sum of all `bags` in donations — live from Supabase on every request. */
export async function getTotalBagsDelivered(): Promise<number> {
  noStore()

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('donations').select('bags')

    if (error) {
      console.error('Failed to fetch donation bag total:', error.message)
      return 0
    }

    if (!data) return 0
    return data.reduce((sum, row) => sum + (row.bags ?? 0), 0)
  } catch (err) {
    console.error('Failed to fetch donation bag total:', err)
    return 0
  }
}

export type LeaderboardSort = 'recent' | 'top'

/**
 * Donors for the public leaderboard — aggregated by email (total bags).
 * `recent`: most recent donation first. `top`: highest total bags first.
 * Email is never exposed.
 */
export async function getLeaderboardDonations(
  limit = LEADERBOARD_DEFAULT_LIMIT,
  sort: LeaderboardSort = 'recent',
): Promise<LeaderboardEntry[]> {
  noStore()

  try {
    const supabase = createAdminClient()
    let query = supabase
      .from('donations')
      .select('first_name, last_name, email, bags, created_at')

    if (sort === 'recent') {
      query = query.order('created_at', { ascending: false }).limit(LEADERBOARD_FETCH_BATCH)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch leaderboard donations:', error.message)
      return []
    }

    if (!data) return []

    const byEmail = new Map<
      string,
      { displayName: string; bags: number; lastDonationAt: string }
    >()

    for (const row of data) {
      const email = row.email.toLowerCase()
      const existing = byEmail.get(email)

      if (existing) {
        existing.bags += row.bags ?? 0
        if (row.created_at > existing.lastDonationAt) {
          existing.lastDonationAt = row.created_at
        }
      } else {
        byEmail.set(email, {
          displayName: formatDonorDisplayName(row.first_name, row.last_name),
          bags: row.bags ?? 0,
          lastDonationAt: row.created_at,
        })
      }
    }

    const entries = Array.from(byEmail.values())

    if (sort === 'top') {
      entries.sort((a, b) => {
        if (b.bags !== a.bags) return b.bags - a.bags
        return (
          new Date(b.lastDonationAt).getTime() -
          new Date(a.lastDonationAt).getTime()
        )
      })
    } else {
      entries.sort(
        (a, b) =>
          new Date(b.lastDonationAt).getTime() -
          new Date(a.lastDonationAt).getTime(),
      )
    }

    return entries.slice(0, limit)
  } catch (err) {
    console.error('Failed to fetch leaderboard donations:', err)
    return []
  }
}
