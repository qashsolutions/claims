import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Mail } from 'lucide-react'
import { Button, Input, Card } from '@claimscrub/ui'
import { resetPasswordForEmail } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await resetPasswordForEmail(email)
      setSuccess(true)
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-neutral-50 p-4 pt-20">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <span className="ml-3 font-heading text-2xl font-bold text-neutral-900">Denali Health</span>
        </div>

        {success ? (
          // Success state
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mb-2 font-heading text-2xl font-bold text-neutral-900">
              Check your email
            </h1>
            <p className="mb-6 text-neutral-600">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="mb-6 text-sm text-neutral-500">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          // Form state
          <>
            <h1 className="mb-2 text-center font-heading text-2xl font-bold text-neutral-900">
              Forgot password?
            </h1>
            <p className="mb-6 text-center text-neutral-600">
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@practice.com"
                required
              />

              {error && (
                <p className="text-body-sm text-error-600">{error}</p>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send reset link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-body-sm text-primary-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
