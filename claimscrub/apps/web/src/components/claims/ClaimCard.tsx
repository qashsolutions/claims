import { useState } from 'react'
import { ChevronDown, ChevronUp, Eye, Edit, MoreVertical, Download, RefreshCw } from 'lucide-react'
import { Badge, Card, Button, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@claimscrub/ui'
import { cn } from '@/lib/utils'
import type { Claim } from '@claimscrub/shared'

/**
 * ClaimCard Component
 *
 * Displays a single claim row with expandable details.
 * Per design mockup 07_claims_list.md:
 *
 * Features:
 * - Checkbox for multi-select
 * - Expandable inline preview
 * - Status badge with denial code
 * - Action menu (View, Edit, Export, etc.)
 *
 * @example
 * ```tsx
 * <ClaimCard
 *   claim={claim}
 *   selected={selectedIds.includes(claim.id)}
 *   onSelect={handleSelect}
 *   onView={() => navigate(`/claims/${claim.id}`)}
 * />
 * ```
 */

interface ClaimCardProps {
  claim: Claim
  selected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  onView?: () => void
  onEdit?: () => void
  onRevalidate?: () => void
  onExport?: () => void
  onDelete?: () => void
  className?: string
}

export function ClaimCard({
  claim,
  selected = false,
  onSelect,
  onView,
  onEdit,
  onRevalidate,
  onExport,
  onDelete,
  className,
}: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Status badge variant and text
  const getStatusConfig = (status: Claim['status']) => {
    const configs: Record<string, { variant: 'success' | 'warning' | 'error' | 'default'; text: string }> = {
      VALIDATED: { variant: 'success', text: 'PASS' },
      SUBMITTED: { variant: 'success', text: 'SUBMITTED' },
      ACCEPTED: { variant: 'success', text: 'ACCEPTED' },
      PAID: { variant: 'success', text: 'PAID' },
      VALIDATING: { variant: 'default', text: 'PENDING' },
      DRAFT: { variant: 'default', text: 'DRAFT' },
      DENIED: { variant: 'error', text: 'FAIL' },
      APPEALING: { variant: 'warning', text: 'APPEALING' },
    }
    return configs[status] || { variant: 'default' as const, text: status }
  }

  const statusConfig = getStatusConfig(claim.status)

  // Format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Get primary denial code if any
  const denialCode = claim.validations?.find(v => v.status === 'FAIL' || v.status === 'WARN')?.denialCode

  return (
    <div
      className={cn(
        'border border-neutral-200 rounded-lg bg-white overflow-hidden',
        'transition-all duration-200',
        selected && 'ring-2 ring-primary-500 border-primary-500',
        className
      )}
    >
      {/* Main Row */}
      <div
        className={cn(
          'flex items-center gap-4 px-4 py-3',
          'hover:bg-neutral-50 transition-colors',
          expanded && 'border-b border-neutral-200'
        )}
      >
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(claim.id, e.target.checked)}
            className={cn(
              'h-4 w-4 rounded border-neutral-300',
              'text-primary-600 focus:ring-primary-500'
            )}
          />
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-1 rounded hover:bg-neutral-100"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          )}
        </button>

        {/* Patient Info */}
        <div className="flex-1 min-w-0">
          <button
            onClick={onView}
            className="font-medium text-neutral-900 hover:text-primary-600 transition-colors truncate block"
          >
            {claim.patientName}
          </button>
          <span className="text-sm text-neutral-500 truncate block">
            {claim.payerName}
          </span>
        </div>

        {/* Claim ID & Charge */}
        <div className="hidden sm:block w-[15%]">
          <span className="font-mono text-sm text-neutral-700 block">
            {claim.claimNumber}
          </span>
          <span className="text-sm text-neutral-500 block">
            {formatCurrency(Number(claim.totalCharge))}
          </span>
        </div>

        {/* CPT Code */}
        <div className="hidden md:block w-[10%]">
          <span className="font-mono text-sm text-neutral-700">
            {claim.serviceLines?.[0]?.cptCode || '-'}
          </span>
        </div>

        {/* Status */}
        <div className="w-[12%] flex flex-col items-start gap-1">
          <Badge variant={statusConfig.variant}>
            {statusConfig.text}
          </Badge>
          {denialCode && (
            <span className="text-xs font-mono text-warning-700">
              {denialCode}
            </span>
          )}
        </div>

        {/* Date of Service */}
        <div className="hidden lg:block w-[12%] text-sm text-neutral-600">
          {formatDate(claim.dateOfService)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onView}
            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <Dropdown>
            <DropdownTrigger asChild>
              <button className="p-1.5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownItem>
              <DropdownItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Claim
              </DropdownItem>
              <DropdownItem onClick={onRevalidate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Revalidate
              </DropdownItem>
              <DropdownItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem variant="danger" onClick={onDelete}>
                Delete
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 py-4 bg-neutral-50">
          <div className="space-y-3">
            {/* Service Lines */}
            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-2">
                Service Lines
              </h4>
              <div className="space-y-2">
                {claim.serviceLines?.map((line, idx) => (
                  <div
                    key={line.id || idx}
                    className="text-sm text-neutral-600 font-mono bg-white px-3 py-2 rounded border border-neutral-200"
                  >
                    Line {line.lineNumber}: {line.cptCode}
                    {line.cptDescription && ` (${line.cptDescription})`}
                    {' - '}
                    {line.icdCodes?.join(', ')}
                    {line.modifiers?.length > 0 && ` - ${line.modifiers.join(', ')}`}
                    {' - '}
                    {formatCurrency(Number(line.charge))}
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Info */}
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <span>
                Validation Score: <strong>{claim.score || '--'}/100</strong>
              </span>
              <span>
                Last Validated: {claim.updatedAt ? formatDate(claim.updatedAt) : 'Never'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" onClick={onView}>
                View Details
              </Button>
              <Button size="sm" variant="secondary" onClick={onRevalidate}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Revalidate
              </Button>
              <Button size="sm" variant="secondary" onClick={onExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button size="sm" variant="secondary" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * ClaimCardMobile - Mobile-optimized claim card
 * Per design mockup 07_claims_list.md Mobile View
 */
interface ClaimCardMobileProps {
  claim: Claim
  onView?: () => void
}

export function ClaimCardMobile({ claim, onView }: ClaimCardMobileProps) {
  const statusConfig = {
    VALIDATED: { variant: 'success' as const, text: 'PASS' },
    DENIED: { variant: 'error' as const, text: 'FAIL' },
    VALIDATING: { variant: 'default' as const, text: 'PENDING' },
  }

  const status = statusConfig[claim.status as keyof typeof statusConfig] || { variant: 'default' as const, text: claim.status }
  const denialCode = claim.validations?.find(v => v.status === 'FAIL' || v.status === 'WARN')?.denialCode

  return (
    <Card className="p-4" onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-neutral-900">{claim.patientName}</h4>
          <p className="text-sm text-neutral-500 font-mono">{claim.claimNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={status.variant}>{status.text}</Badge>
          {denialCode && (
            <span className="text-xs font-mono text-warning-700">{denialCode}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-neutral-600">
        <span className="font-mono">{claim.serviceLines?.[0]?.cptCode}</span>
        <span>${Number(claim.totalCharge).toLocaleString()}</span>
        <span>{new Date(claim.dateOfService).toLocaleDateString()}</span>
      </div>
    </Card>
  )
}
