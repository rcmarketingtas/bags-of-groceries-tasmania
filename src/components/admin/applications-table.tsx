import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { updateApplicationStatus } from '@/actions/admin'
import type { Application, ApplicationStatus } from '@/types'

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: 'default' | 'success' | 'destructive' | 'warning' | 'info' | 'outline' | 'secondary' }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  assisted: { label: 'Assisted', variant: 'info' },
}

interface ApplicationsTableProps {
  applications: Application[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Button asChild variant="outline" size="sm">
            <a href="/api/admin/export/applications" download>
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          </Button>
        </div>
        <div className="rounded-lg border bg-muted/20 py-16 text-center text-muted-foreground">
          No applications found.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </p>
        <Button asChild variant="outline" size="sm">
          <a href="/api/admin/export/applications" download>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </Button>
      </div>
      <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Family Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => {
            const statusInfo = statusConfig[app.status]
            return (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-medium">
                    {app.first_name} {app.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {app.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{app.address}</div>
                  <div className="text-xs text-muted-foreground">
                    {app.suburb} {app.postcode}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {app.adults} adult{app.adults !== 1 ? 's' : ''}
                    {app.children > 0 &&
                      `, ${app.children} child${app.children !== 1 ? 'ren' : ''}`}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(app.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {app.status === 'pending' && (
                      <>
                        <form action={updateApplicationStatus}>
                          <input type="hidden" name="id" value={app.id} />
                          <input type="hidden" name="status" value="approved" />
                          <Button
                            type="submit"
                            size="sm"
                            variant="default"
                            className="h-7 px-2 text-xs"
                          >
                            Approve
                          </Button>
                        </form>
                        <form action={updateApplicationStatus}>
                          <input type="hidden" name="id" value={app.id} />
                          <input type="hidden" name="status" value="rejected" />
                          <Button
                            type="submit"
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2 text-xs"
                          >
                            Reject
                          </Button>
                        </form>
                      </>
                    )}
                    {app.status === 'approved' && (
                      <form action={updateApplicationStatus}>
                        <input type="hidden" name="id" value={app.id} />
                        <input type="hidden" name="status" value="assisted" />
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          className="h-7 px-2 text-xs"
                        >
                          Mark Assisted
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
