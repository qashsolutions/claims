import { Plus, Upload, FileSpreadsheet } from 'lucide-react'
import { Card, Button } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * QuickActions Component
 *
 * Quick action buttons for common claim operations.
 * Per design mockup 02_dashboard.md:
 *
 * Actions:
 * - New Claim: Opens claim entry form
 * - Upload 837: Opens file picker for 837 files
 * - Batch CSV: Opens file picker for CSV batch uploads
 *
 * @example
 * ```tsx
 * <QuickActions
 *   onNewClaim={() => navigate('/claims/new')}
 *   onUpload837={handle837Upload}
 *   onBatchCSV={handleBatchUpload}
 * />
 * ```
 */

interface QuickActionsProps {
  onNewClaim?: () => void
  onUpload837?: () => void
  onBatchCSV?: () => void
  className?: string
}

export function QuickActions({
  onNewClaim,
  onUpload837,
  onBatchCSV,
  className,
}: QuickActionsProps) {
  return (
    <Card className={cn('p-6', className)}>
      <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* New Claim */}
        <QuickActionButton
          icon={<Plus className="h-6 w-6" />}
          label="New Claim"
          onClick={onNewClaim}
        />

        {/* Upload 837 */}
        <QuickActionButton
          icon={<Upload className="h-6 w-6" />}
          label="Upload 837"
          onClick={onUpload837}
        />

        {/* Batch CSV */}
        <QuickActionButton
          icon={<FileSpreadsheet className="h-6 w-6" />}
          label="Batch CSV"
          onClick={onBatchCSV}
        />
      </div>
    </Card>
  )
}

/**
 * QuickActionButton - Individual action button
 */
interface QuickActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
}

function QuickActionButton({ icon, label, onClick, disabled }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        'p-6 rounded-lg border border-neutral-200 bg-white',
        'transition-all duration-200',
        'hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200'
      )}
    >
      <div className="text-primary-600">{icon}</div>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </button>
  )
}

/**
 * EmptyState - Shown when no claims exist yet
 * Per design mockup 02_dashboard.md Empty State section
 */
interface EmptyStateProps {
  onCreateClaim?: () => void
}

export function DashboardEmptyState({ onCreateClaim }: EmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <FileSpreadsheet className="h-8 w-8 text-neutral-400" />
        </div>

        <h3 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
          No claims validated yet
        </h3>

        <p className="text-neutral-500 max-w-md mb-6">
          Start by creating your first claim or uploading an 837 file for validation.
        </p>

        <Button onClick={onCreateClaim}>
          <Plus className="h-4 w-4 mr-2" />
          Create First Claim
        </Button>
      </div>
    </Card>
  )
}
