import { DollarSign, ShoppingBag, Users, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { AdminMetrics } from '@/types'

interface MetricsCardsProps {
  metrics: AdminMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Donations',
      value: metrics.totalDonations.toString(),
      icon: ShoppingBag,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: 'Total Applications',
      value: metrics.totalApplications.toString(),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Pending Review',
      value: metrics.pendingApplications.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Approved',
      value: metrics.approvedApplications.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
