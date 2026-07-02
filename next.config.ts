import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'bagsofgroceries.org',
        'www.bagsofgroceries.org',
        'bags-of-groceries-tasmania.vercel.app',
      ],
    },
  },
}

export default nextConfig
