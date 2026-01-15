import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button, Input, Card } from '@claimscrub/ui'
import { updatePassword } from '@/lib/supabase'

// Password must be 8+ chars with uppercase, lowercase, and special character
function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  return null
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate password format
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError('Failed to reset password. The link may have expired.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
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
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mb-2 font-heading text-2xl font-bold text-neutral-900">
              Password reset!
            </h1>
            <p className="mb-6 text-neutral-600">
              Your password has been successfully reset. Redirecting to sign in...
            </p>
            <Link
              to="/login"
              className="text-primary-600 hover:underline"
            >
              Click here if not redirected
            </Link>
          </div>
        ) : (
          // Form state
          <>
            <h1 className="mb-2 text-center font-heading text-2xl font-bold text-neutral-900">
              Set new password
            </h1>
            <p className="mb-6 text-center text-neutral-600">
              Enter your new password below
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-neutral-500">
                  8+ characters, uppercase, lowercase, and special character
                </p>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <p className="text-body-sm text-error-600">{error}</p>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Reset password
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-body-sm text-primary-600 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
