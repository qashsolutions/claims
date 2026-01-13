import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage').then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/LoginPage')) // Uses same component with register mode
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const ClaimsListPage = lazy(() => import('@/pages/claims/ClaimsListPage'))
const NewClaimPage = lazy(() => import('@/pages/claims/NewClaimPage'))
const ClaimDetailPage = lazy(() => import('@/pages/claims/ClaimDetailPage').then(m => ({ default: m.ClaimDetailPage })))
const SettingsPage = lazy(() => import('@/pages/settings/ProfilePage'))
const BillingPage = lazy(() => import('@/pages/settings/BillingPage').then(m => ({ default: m.BillingPage })))
const OnboardingFlow = lazy(() => import('@/pages/onboarding/OnboardingFlow').then(m => ({ default: m.OnboardingFlow })))

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/claims" element={<ClaimsListPage />} />
            <Route path="/claims/new" element={<NewClaimPage />} />
            <Route path="/claims/:id" element={<ClaimDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/billing" element={<BillingPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
