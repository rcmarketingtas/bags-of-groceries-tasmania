'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0F19]/90 backdrop-blur supports-[backdrop-filter]:bg-[#0B0F19]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-80"
        >
          <ShoppingBag className="h-5 w-5 text-[#3d6b51]" />
          <span className="hidden sm:inline-block">
            Bags of Groceries Tasmania
          </span>
          <span className="sm:hidden">BoGT</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/15 bg-transparent text-white/80 hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            <Link href="/apply">Apply for Assistance</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="btn-glow bg-[#3d6b51] text-white hover:bg-[#4a7d61]"
          >
            <Link href="/sponsor">Buy a Bag of Groceries</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="text-white/70 hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-96' : 'max-h-0',
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-white/5 bg-[#0F1623] px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
            <Button
              asChild
              variant="outline"
              className="w-full border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white"
            >
              <Link href="/apply" onClick={() => setMobileOpen(false)}>
                Apply for Assistance
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-[#3d6b51] text-white hover:bg-[#4a7d61]"
            >
              <Link href="/sponsor" onClick={() => setMobileOpen(false)}>
                Buy a Bag of Groceries
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
