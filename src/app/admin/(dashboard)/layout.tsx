import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ShoppingBag,
  LogOut,
} from 'lucide-react'
import { adminLogout } from '@/actions/admin'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: Users },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-white lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-primary"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
          <div className="mt-2 px-3">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-primary"
          >
            <ShoppingBag className="h-5 w-5" />
            Admin
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
            <form action={adminLogout}>
              <button
                type="submit"
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
