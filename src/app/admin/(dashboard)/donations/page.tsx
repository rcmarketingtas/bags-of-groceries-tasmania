import type { Metadata } from 'next'
import { DonationsTable } from '@/components/admin/donations-table'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/utils'
import type { Donation } from '@/types'

export const metadata: Metadata = { title: 'Donations — Admin' }

export const dynamic = 'force-dynamic'

async function getDonations(): Promise<Donation[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching donations:', error)
    return []
  }
  return data ?? []
}

export default async function AdminDonationsPage() {
  const donations = await getDonations()

  const totalRevenue = donations.reduce((sum, d) => sum + d.amount, 0)
  const totalBags = donations.reduce((sum, d) => sum + d.bags, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
        <p className="text-sm text-muted-foreground">
          {donations.length} donation{donations.length !== 1 ? 's' : ''} ·{' '}
          {formatCurrency(totalRevenue)} raised · {totalBags} bag
          {totalBags !== 1 ? 's' : ''} sponsored
        </p>
      </div>

      <DonationsTable donations={donations} />
    </div>
  )
}
