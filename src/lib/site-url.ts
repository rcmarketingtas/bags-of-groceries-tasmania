const DEFAULT_SITE_URL = 'https://bags-of-groceries-tasmania.vercel.app'

/** Canonical site origin from NEXT_PUBLIC_SITE_URL (no trailing slash). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  return url.replace(/\/$/, '')
}
