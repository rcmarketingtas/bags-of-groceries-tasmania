import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Donation } from '@/types'

interface DonationsTableProps {
  donations: Donation[]
}

export function DonationsTable({ donations }: DonationsTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {donations.length} donation{donations.length !== 1 ? 's' : ''}
        </p>
        <Button asChild variant="outline" size="sm">
          <a href="/api/admin/export/donations" download>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </Button>
      </div>

      {donations.length === 0 ? (
        <div className="rounded-lg border bg-muted/20 py-16 text-center text-muted-foreground">
          No donations yet.
        </div>
      ) : (
        <div className="rounded-xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bags</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {donation.first_name} {donation.last_name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {donation.email}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatCurrency(donation.amount)}
                  </TableCell>
                  <TableCell>{donation.bags}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(donation.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
