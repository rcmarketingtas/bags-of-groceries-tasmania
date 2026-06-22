'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const statusSchema = z.enum(['approved', 'rejected', 'assisted'])

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

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Invalid email or password.' }

  redirect('/admin')
}

export async function adminLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
