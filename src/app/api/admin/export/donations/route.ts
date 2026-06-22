import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDate } from '@/lib/utils'

export async function GET() {
  // Verify admin is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
  const { data: donations, error } = await adminClient
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }

  const headers = ['Name', 'Email', 'Amount (AUD)', 'Bags', 'Message', 'Stripe Payment ID', 'Date']

  const rows = (donations ?? []).map((d) => [
    `${d.first_name} ${d.last_name}`,
    d.email,
    (d.amount / 100).toFixed(2),
    d.bags,
    d.message ?? '',
    d.stripe_payment_id,
    formatDate(d.created_at),
  ])

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="donations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
