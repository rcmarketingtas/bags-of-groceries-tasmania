import type { Metadata } from 'next'
import { ApplicationsTable } from '@/components/admin/applications-table'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Application } from '@/types'

export const metadata: Metadata = { title: 'Applications — Admin' }

export const dynamic = 'force-dynamic'

async function getApplications(): Promise<Application[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }
  return data ?? []
}

export default async function AdminApplicationsPage() {
  const applications = await getApplications()

  const counts = {
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    assisted: applications.filter((a) => a.status === 'assisted').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-muted-foreground">
          {applications.length} total application
          {applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-3 text-sm">
        {Object.entries(counts).map(([status, count]) => (
          <span
            key={status}
            className="rounded-full bg-muted px-3 py-1 font-medium capitalize"
          >
            {status}: {count}
          </span>
        ))}
      </div>

      <ApplicationsTable applications={applications} />
    </div>
  )
}
