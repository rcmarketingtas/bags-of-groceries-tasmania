import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

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
