import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bagsofgroceries.org.au'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bags of Groceries Tasmania — Help Put Food on the Table',
    template: '%s | Bags of Groceries Tasmania',
  },
  description:
    'Support Tasmanian families experiencing hardship by sponsoring grocery bags. Sponsor from $25 or apply for assistance today.',
  keywords: [
    'Tasmania',
    'food assistance',
    'grocery sponsorship',
    'community support',
    'family hardship',
    'donate',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: siteUrl,
    siteName: 'Bags of Groceries Tasmania',
    title: 'Bags of Groceries Tasmania — Help Put Food on the Table',
    description:
      'Support Tasmanian families experiencing hardship by sponsoring grocery bags.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bags of Groceries Tasmania',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bags of Groceries Tasmania',
    description:
      'Support Tasmanian families experiencing hardship by sponsoring grocery bags.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
