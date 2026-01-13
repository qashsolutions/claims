import { ChevronRight, Eye, Edit } from 'lucide-react'
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * RecentValidations Component
 *
 * Displays a table of recently validated claims.
 * Per design mockup 02_dashboard.md:
 *
 * Columns:
 * - Patient: 25%, Name clickable
 * - CPT: 15%, Code monospace
 * - Status: 15%, Badge (Pass/Warn/Fail)
 * - Risk: 20%, Denial code or "--"
 * - Time: 15%, Relative time
 * - Actions: 10%, View/Edit icons
 *
 * @example
 * ```tsx
 * <RecentValidations
 *   validations={recentValidations}
 *   onViewAll={() => navigate('/claims')}
 *   onViewClaim={(id) => navigate(`/claims/${id}`)}
 * />
 * ```
 */

interface ValidationRow {
  id: string
  claimId: string
  patientName: string
  cptCode: string
  status: 'PASS' | 'WARN' | 'FAIL'
  riskCode?: string
  validatedAt: Date
}

interface RecentValidationsProps {
  validations: ValidationRow[]
  onViewAll?: () => void
  onViewClaim?: (id: string) => void
  onEditClaim?: (id: string) => void
  className?: string
}

export function RecentValidations({
  validations,
  onViewAll,
  onViewClaim,
  onEditClaim,
  className,
}: RecentValidationsProps) {
  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hr ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  // Status badge variant mapping
  const statusVariant = {
    PASS: 'success' as const,
    WARN: 'warning' as const,
    FAIL: 'error' as const,
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
        <h3 className="font-heading text-lg font-semibold text-neutral-900">
          Recent Validations
        </h3>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-neutral-700 w-[25%]">
                Patient
              </th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-700 w-[15%]">
                CPT
              </th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-700 w-[15%]">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-700 w-[20%]">
                Risk
              </th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-700 w-[15%]">
                Time
              </th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-700 w-[10%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {validations.map((validation) => (
              <tr
                key={validation.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                {/* Patient Name */}
                <td className="px-6 py-3">
                  <button
                    onClick={() => onViewClaim?.(validation.claimId)}
                    className="font-medium text-neutral-900 hover:text-primary-600 transition-colors"
                  >
                    {validation.patientName}
                  </button>
                </td>

                {/* CPT Code */}
                <td className="px-4 py-3">
                  <span className="font-mono text-neutral-700">
                    {validation.cptCode}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[validation.status]}>
                    {validation.status}
                  </Badge>
                </td>

                {/* Risk Code */}
                <td className="px-4 py-3">
                  {validation.riskCode ? (
                    <span className="font-mono text-warning-700">
                      {validation.riskCode}
                    </span>
                  ) : (
                    <span className="text-neutral-400">--</span>
                  )}
                </td>

                {/* Time */}
                <td className="px-4 py-3 text-neutral-500">
                  {formatRelativeTime(validation.validatedAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewClaim?.(validation.claimId)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                      title="View claim"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditClaim?.(validation.claimId)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                      title="Edit claim"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {validations.length === 0 && (
        <div className="px-6 py-12 text-center text-neutral-500">
          No recent validations to display.
        </div>
      )}
    </Card>
  )
}
