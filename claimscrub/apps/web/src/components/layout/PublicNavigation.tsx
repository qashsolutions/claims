import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/lib/supabase'

function formatLastSignIn(dateString: string | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function PublicNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold text-neutral-900">
                Denali Health
              </span>
              <span className="text-[8px] text-neutral-500">
                Denials Prevention for Providers
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Features
            </Link>
            <Link to="/#pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Pricing
            </Link>
          </div>

          {/* CTA Buttons / User Info */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* User Info */}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-neutral-900">{user.email}</span>
                  {user.last_sign_in_at && (
                    <span className="text-[10px] text-neutral-500">
                      Last login: {formatLastSignIn(user.last_sign_in_at)}
                    </span>
                  )}
                </div>
                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Dashboard
                </Link>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-600"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            <div className="flex flex-col gap-4">
              <Link to="/#features" className="text-neutral-600 hover:text-neutral-900">Features</Link>
              <Link to="/#pricing" className="text-neutral-600 hover:text-neutral-900">Pricing</Link>
              <hr className="border-neutral-200" />
              {isAuthenticated && user ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-900">{user.email}</span>
                    {user.last_sign_in_at && (
                      <span className="text-[10px] text-neutral-500">
                        Last login: {formatLastSignIn(user.last_sign_in_at)}
                      </span>
                    )}
                  </div>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-700 font-medium rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-neutral-700 font-medium">Log in</Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg"
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
