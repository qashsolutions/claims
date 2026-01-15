import { Outlet } from 'react-router-dom'
import { PublicNavigation } from './PublicNavigation'
import { PublicFooter } from './PublicFooter'
import { AskDenali } from '@/components/askDenali'

/**
 * PublicLayout - Universal layout wrapper for all public-facing pages
 *
 * Includes:
 * - Navigation header (with auth state awareness)
 * - Footer with legal links
 * - Nico (AskDenali) floating chat assistant
 */
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavigation />

      {/* Main content area - add pt-16 to account for fixed nav */}
      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />

      {/* Nico floating chat assistant */}
      <AskDenali variant="floating" />
    </div>
  )
}
