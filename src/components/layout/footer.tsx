import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Bags of Groceries Tasmania</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Two locals from Launceston trying to help.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/sponsor" className="hover:text-foreground transition-colors">Buy a Bag of Groceries</Link>
            <Link href="/apply" className="hover:text-foreground transition-colors">Apply for Assistance</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>Made with care in Launceston, Tasmania &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
