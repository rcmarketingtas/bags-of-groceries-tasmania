#!/usr/bin/env node
/**
 * Create a confirmed Supabase admin user for /admin/login.
 *
 * Usage (from project root, with .env.local or exported vars):
 *   node scripts/create-admin-user.mjs you@example.com YourSecurePassword
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (service_role JWT)
 */

import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]?.trim()
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: node scripts/create-admin-user.mjs <email> <password>')
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.',
  )
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  console.error('Failed to create admin user:', error.message)
  process.exit(1)
}

console.log('Admin user created successfully.')
console.log('  Email:', data.user?.email)
console.log('  Confirmed: yes (email_confirm: true)')
console.log('  Sign in at: /admin/login')
