import { useAuth } from '@/hooks/useAuth'
import { Button } from '@claimscrub/ui'

export function TopNav() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <span className="text-body-sm text-neutral-500">
          Tab + Enter to navigate
        </span>
        <span className="kbd">Tab</span>
        <span className="kbd">Enter</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-body-sm text-neutral-600">{user?.email}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  )
}
