import type { Metadata } from 'next'
import { MetricsCards } from '@/components/admin/metrics-cards'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AdminMetrics } from '@/types'

export const metadata: Metadata = { title: 'Dashboard — Admin' }

export const dynamic = 'force-dynamic'

async function getMetrics(): Promise<AdminMetrics> {
  const supabase = createAdminClient()

  const [donations, applications] = await Promise.all([
    supabase.from('donations').select('amount'),
    supabase.from('applications').select('status'),
  ])

  const totalDonations = donations.data?.length ?? 0
  const totalRevenue =
    donations.data?.reduce((sum, d) => sum + (d.amount ?? 0), 0) ?? 0

  const apps = applications.data ?? []
  const totalApplications = apps.length
  const pendingApplications = apps.filter((a) => a.status === 'pending').length
  const approvedApplications = apps.filter(
    (a) => a.status === 'approved',
  ).length

  return {
    totalDonations,
    totalRevenue,
    totalApplications,
    pendingApplications,
    approvedApplications,
  }
}

export default async function AdminDashboardPage() {
  const metrics = await getMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of donations and applications
        </p>
      </div>
      <MetricsCards metrics={metrics} />
    </div>
  )
}
