import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080C14]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-[#3d6b51] transition-opacity hover:opacity-80"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Bags of Groceries Tasmania</span>
            </Link>
            <p className="text-sm text-white/40">
              We won&apos;t let Tassie go hungry tonight.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40">
            <Link href="/sponsor" className="transition-colors hover:text-white/80">Buy a Bag of Groceries</Link>
            <Link href="/apply" className="transition-colors hover:text-white/80">Apply for Assistance</Link>
            <Link href="/about" className="transition-colors hover:text-white/80">About</Link>
            <Link href="/contact" className="transition-colors hover:text-white/80">Contact</Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-white/25">
          <p>Made with care in Launceston, Tasmania &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
