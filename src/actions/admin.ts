'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createActionClient } from '@/lib/supabase/action'

const statusSchema = z.enum(['approved', 'rejected', 'assisted'])

function mapAuthErrorMessage(code: string | undefined, message: string): string {
  switch (code) {
    case 'email_not_confirmed':
      return 'This account is not confirmed yet. In Supabase, recreate the user with Auto Confirm User enabled, or confirm the email.'
    case 'invalid_credentials':
      return 'Invalid email or password. Create the admin user in Supabase → Authentication → Users (same project as your Vercel NEXT_PUBLIC_SUPABASE_URL).'
    case 'user_banned':
      return 'This account has been disabled in Supabase.'
    default:
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return 'Admin login is not configured. Supabase environment variables are missing on the server.'
      }
      console.error('[adminLogin] Supabase auth error:', { code, message })
      return 'Invalid email or password.'
  }
}

export async function updateApplicationStatus(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const id = formData.get('id') as string
  const status = formData.get('status') as string

  const parsed = statusSchema.safeParse(status)
  if (!parsed.success || !id) return

  const { error } = await supabase
    .from('applications')
    .update({ status: parsed.data })
    .eq('id', id)

  if (error) console.error('Update error:', error)

  revalidatePath('/admin/applications')
}

export async function adminLogin(
  _prevState: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      error:
        'Admin login is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.',
    }
  }

  const supabase = await createActionClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: mapAuthErrorMessage(error.code, error.message) }
  }

  redirect('/admin')
}

export async function adminLogout() {
  const supabase = await createActionClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
