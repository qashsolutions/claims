import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signInWithEmail, signOut } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore()

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
      navigate('/')
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const handleLogout = async () => {
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
