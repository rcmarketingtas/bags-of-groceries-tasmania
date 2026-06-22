import Link from 'next/link'
import { ShoppingBag, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Bags of Groceries Tasmania</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping Tasmanian families experiencing hardship by providing
              grocery support through community generosity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/sponsor', label: 'Sponsor a Bag' },
                { href: '/apply', label: 'Apply for Assistance' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Get Involved
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Every bag you sponsor helps put food on the table for a Tasmanian
              family.
            </p>
            <Link
              href="/sponsor"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Heart className="h-4 w-4" />
              Sponsor a Bag
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Bags of Groceries Tasmania. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
