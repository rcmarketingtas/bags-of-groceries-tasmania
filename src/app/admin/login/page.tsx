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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bags of Groceries Tasmania
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-border">
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>

            {state?.error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
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
