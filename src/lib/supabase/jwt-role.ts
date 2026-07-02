/** Decode Supabase JWT payload role without verifying signature (env sanity check only). */
export function getSupabaseJwtRole(key: string | undefined): string | null {
  if (!key?.trim()) return null

  const parts = key.trim().split('.')
  if (parts.length !== 3) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const payload = JSON.parse(
      Buffer.from(padded, 'base64').toString('utf8'),
    ) as { role?: string }
    return payload.role ?? null
  } catch {
    return null
  }
}

export function isSupabaseServiceRoleKey(key: string | undefined): boolean {
  return getSupabaseJwtRole(key) === 'service_role'
}
