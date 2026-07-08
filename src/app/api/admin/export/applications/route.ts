import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDate } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
  const { data: applications, error } = await adminClient
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }

  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Address',
    'Suburb',
    'Postcode',
    'Adults',
    'Children',
    'Status',
    'Media Consent',
    'Circumstances',
    'Date Applied',
  ]

  const rows = (applications ?? []).map((a) => [
    a.first_name,
    a.last_name,
    a.email,
    a.phone,
    a.address,
    a.suburb,
    a.postcode,
    a.adults,
    a.children,
    a.status,
    a.media_consent ? 'Yes' : 'No',
    a.circumstances,
    formatDate(a.created_at),
  ])

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
