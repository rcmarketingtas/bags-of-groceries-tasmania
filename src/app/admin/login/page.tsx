'use client'

import { useActionState } from 'react'
import { ShoppingBag, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminLogin } from '@/actions/admin'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLogin, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#3d6b51] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1c4d31]">
            <ShoppingBag className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
          <p className="mt-1 text-sm text-[#A3C2B2]">
            Bags of Groceries Tasmania
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-[#163d27] bg-[#1c4d31] p-8">
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#A3C2B2]">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required autoComplete="email" autoFocus
                className="border-[#163d27] bg-[#163d27]/60 text-white placeholder:text-[#A3C2B2]/50 focus:border-[#A3C2B2]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#A3C2B2]">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password"
                className="border-[#163d27] bg-[#163d27]/60 text-white focus:border-[#A3C2B2]" />
            </div>

            {state?.error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            <Button type="submit" className="btn-glow w-full bg-white text-[#1c4d31] hover:bg-[#F4F7F5]" size="lg" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
