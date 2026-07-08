export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'assisted'

export interface Donation {
  id: string
  first_name: string
  last_name: string
  email: string
  amount: number
  bags: number
  message: string | null
  stripe_payment_id: string
  created_at: string
}

export interface Application {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  suburb: string
  postcode: string
  adults: number
  children: number
  circumstances: string
  status: ApplicationStatus
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface AdminMetrics {
  totalDonations: number
  totalRevenue: number
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
}
