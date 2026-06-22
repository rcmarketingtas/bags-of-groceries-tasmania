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
    <header className="sticky top-0 z-50 w-full border-b border-[#D5E0DA] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[#1c4d31] transition-opacity hover:opacity-75"
        >
          <ShoppingBag className="h-5 w-5" />
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
              className="text-sm font-medium text-[#1c4d31]/70 transition-colors hover:text-[#1c4d31]"
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
            className="border-[#D5E0DA] text-[#1c4d31] hover:bg-[#F4F7F5] hover:text-[#1c4d31]"
          >
            <Link href="/apply">Apply for Assistance</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="btn-glow bg-[#1c4d31] text-white hover:bg-[#163d27]"
          >
            <Link href="/sponsor">Buy a Bag of Groceries</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="text-[#1c4d31] md:hidden"
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
        <nav className="flex flex-col gap-1 border-t border-[#D5E0DA] bg-white px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1c4d31]/70 transition-colors hover:bg-[#F4F7F5] hover:text-[#1c4d31]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-[#D5E0DA] pt-3">
            <Button
              asChild
              variant="outline"
              className="w-full border-[#D5E0DA] text-[#1c4d31] hover:bg-[#F4F7F5]"
            >
              <Link href="/apply" onClick={() => setMobileOpen(false)}>
                Apply for Assistance
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-[#1c4d31] text-white hover:bg-[#163d27]"
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
