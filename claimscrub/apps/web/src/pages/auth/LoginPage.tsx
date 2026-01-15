import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { Button, Input, Card } from '@claimscrub/ui'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
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

        <h1 className="mb-6 text-center font-heading text-2xl font-bold text-neutral-900">
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@practice.com"
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          {error && (
            <p className="text-body-sm text-error-600">{error}</p>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-body-sm text-primary-600 hover:underline">
            Forgot your password?
          </a>
        </div>
      </Card>
    </div>
  )
}
