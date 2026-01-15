import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signInWithEmail, signOut } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { trpc } from '@/lib/trpc'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore()
  const auditMutation = trpc.audit.logEvent.useMutation()

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { user } = await signInWithEmail(email, password)
      setUser(user)

      // Log login event (fire-and-forget, don't block login)
      if (user?.id) {
        auditMutation.mutate(
          {
            userId: user.id,
            action: 'LOGIN',
            metadata: { method: 'password' },
            userAgent: navigator.userAgent,
          },
          {
            onError: (err) => {
              console.warn('[Audit] Failed to log login event:', err)
            },
          }
        )
      }

      navigate('/dashboard')
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const handleLogout = async () => {
    // Log logout event (fire-and-forget, don't block logout)
    if (user?.id) {
      auditMutation.mutate(
        {
          userId: user.id,
          action: 'LOGOUT',
          userAgent: navigator.userAgent,
        },
        {
          onError: (err) => {
            console.warn('[Audit] Failed to log logout event:', err)
          },
        }
      )
    }

    await signOut()
    logout()
    navigate('/login')
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
  }
}
