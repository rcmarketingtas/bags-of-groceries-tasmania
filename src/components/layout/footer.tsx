import Link from 'next/link'
import { ShoppingBag, Facebook } from 'lucide-react'
import { FB_PAGE_URL } from '@/lib/facebook'
import { isShopEnabled } from '@/lib/shop-config'

export function Footer() {
  const shopEnabled = isShopEnabled()
  return (
    <footer className="border-t border-[#163d27] bg-[#1c4d31]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-75"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Bags of Groceries Tasmania</span>
            </Link>
            <p className="text-sm text-[#A3C2B2]">
              Feeding Tassie families, one bag at a time.
            </p>
            {/* Facebook page link */}
            <a
              href={FB_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#A3C2B2] transition-colors hover:text-white"
            >
              <Facebook className="h-4 w-4" />
              Follow our Journey on Facebook
            </a>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#A3C2B2]">
            <Link href="/sponsor" className="transition-colors hover:text-white">Give a Bag of Groceries</Link>
            <Link href="/apply" className="transition-colors hover:text-white">Apply for Assistance</Link>
            <Link href="/about" className="transition-colors hover:text-white">About</Link>
            <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
            {shopEnabled && (
              <Link href="/shop/caramel-slices" className="transition-colors hover:text-white">Caramel Slices</Link>
            )}
          </nav>
        </div>

        <div className="mt-8 border-t border-[#163d27] pt-6 text-center text-xs text-[#A3C2B2]/60">
          <p>Made with care in Launceston, Tasmania &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
