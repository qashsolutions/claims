import { useState, useMemo } from 'react'
import { Plus, FileText, Search } from 'lucide-react'
import { Button, Card, TablePagination } from '@claimscrub/ui'
import { cn } from '@/lib/utils'
import { ClaimCard, ClaimCardMobile } from './ClaimCard'
import { ClaimFilters, ClaimBulkActions, type ClaimFilterValues } from './ClaimFilters'
import type { Claim } from '@claimscrub/shared'

/**
 * ClaimsList Component
 *
 * Full claims list view with filtering, sorting, and bulk actions.
 * Per design mockup 07_claims_list.md
 *
 * Features:
 * - Status filter tabs
 * - Advanced filter panel
 * - Search and sort
 * - Multi-select with bulk actions
 * - Pagination
 * - Responsive (card view on mobile)
 *
 * @example
 * ```tsx
 * <ClaimsList
 *   claims={claims}
 *   total={totalClaims}
 *   isLoading={isLoading}
 *   onNewClaim={() => navigate('/claims/new')}
 *   onViewClaim={(id) => navigate(`/claims/${id}`)}
 * />
 * ```
 */

interface ClaimsListProps {
  claims: Claim[]
  total: number
  isLoading?: boolean
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  filters?: ClaimFilterValues
  onFilterChange?: (filters: ClaimFilterValues) => void
  counts?: {
    all: number
    pass: number
    warning: number
    fail: number
    pending: number
  }
  onNewClaim?: () => void
  onViewClaim?: (id: string) => void
  onEditClaim?: (id: string) => void
  onDeleteClaims?: (ids: string[]) => void
  onExportClaims?: (ids: string[]) => void
  onRevalidateClaims?: (ids: string[]) => void
  className?: string
}

export function ClaimsList({
  claims,
  total,
  isLoading = false,
  page = 1,
  pageSize = 25,
  onPageChange,
  onPageSizeChange,
  filters = { status: 'all', sortBy: 'newest' },
  onFilterChange,
  counts = { all: 0, pass: 0, warning: 0, fail: 0, pending: 0 },
  onNewClaim,
  onViewClaim,
  onEditClaim,
  onDeleteClaims,
  onExportClaims,
  onRevalidateClaims,
  className,
}: ClaimsListProps) {
  // Selected claim IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Handle individual selection
  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((i) => i !== id)
    )
  }

  // Handle select all on current page
  const handleSelectAll = (selected: boolean) => {
    setSelectedIds(selected ? claims.map((c) => c.id) : [])
  }

  // Check if all on current page are selected
  const allSelected = claims.length > 0 && claims.every((c) => selectedIds.includes(c.id))
  const someSelected = selectedIds.length > 0 && !allSelected

  // Handle bulk actions
  const handleBulkDelete = () => {
    onDeleteClaims?.(selectedIds)
    setSelectedIds([])
  }

  const handleBulkExport = () => {
    onExportClaims?.(selectedIds)
  }

  const handleBulkRevalidate = () => {
    onRevalidateClaims?.(selectedIds)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Claims</h1>
        {onNewClaim && (
          <Button onClick={onNewClaim}>
            <Plus className="h-4 w-4 mr-2" />
            New Claim
          </Button>
        )}
      </div>

      {/* Filters */}
      {onFilterChange && (
        <ClaimFilters
          filters={filters}
          onFilterChange={onFilterChange}
          counts={counts}
        />
      )}

      {/* Bulk Actions Bar */}
      <ClaimBulkActions
        selectedCount={selectedIds.length}
        onExport={handleBulkExport}
        onRevalidate={handleBulkRevalidate}
        onDelete={handleBulkDelete}
        onDeselectAll={() => setSelectedIds([])}
      />

      {/* Results Count */}
      <div className="text-sm text-neutral-600">
        Showing {claims.length} of {total} claims
      </div>

      {/* Claims List */}
      {isLoading ? (
        <ClaimsListLoading />
      ) : claims.length === 0 ? (
        filters.search || filters.status !== 'all' ? (
          <ClaimsListEmptyFiltered onClearFilters={() => onFilterChange?.({ status: 'all', sortBy: 'newest' })} />
        ) : (
          <ClaimsListEmpty onNewClaim={onNewClaim} />
        )
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card className="overflow-hidden">
              {/* Table Header */}
              <div className="flex items-center gap-4 px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="w-8" /> {/* Spacer for expand button */}
                <div className="flex-1 font-semibold text-sm text-neutral-700">Patient</div>
                <div className="hidden sm:block w-[15%] font-semibold text-sm text-neutral-700">Claim ID</div>
                <div className="hidden md:block w-[10%] font-semibold text-sm text-neutral-700">CPT</div>
                <div className="w-[12%] font-semibold text-sm text-neutral-700">Status</div>
                <div className="hidden lg:block w-[12%] font-semibold text-sm text-neutral-700">DOS</div>
                <div className="w-[100px]" /> {/* Actions column */}
              </div>

              {/* Claim Rows */}
              <div className="divide-y divide-neutral-100">
                {claims.map((claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    selected={selectedIds.includes(claim.id)}
                    onSelect={handleSelect}
                    onView={() => onViewClaim?.(claim.id)}
                    onEdit={() => onEditClaim?.(claim.id)}
                    onRevalidate={() => onRevalidateClaims?.([claim.id])}
                    onExport={() => onExportClaims?.([claim.id])}
                    onDelete={() => onDeleteClaims?.([claim.id])}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {claims.map((claim) => (
              <ClaimCardMobile
                key={claim.id}
                claim={claim}
                onView={() => onViewClaim?.(claim.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {total > pageSize && onPageChange && (
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </>
      )}
    </div>
  )
}

/**
 * ClaimsListEmpty - Empty state when no claims exist
 */
function ClaimsListEmpty({ onNewClaim }: { onNewClaim?: () => void }) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
          No claims validated yet
        </h3>
        <p className="text-neutral-500 max-w-md mb-6">
          Start by creating your first claim or uploading an 837 file for validation.
        </p>
        {onNewClaim && (
          <Button onClick={onNewClaim}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Claim
          </Button>
        )}
      </div>
    </Card>
  )
}

/**
 * ClaimsListEmptyFiltered - Empty state when filters return no results
 */
function ClaimsListEmptyFiltered({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
          No claims match your filters
        </h3>
        <p className="text-neutral-500 max-w-md mb-6">
          Try adjusting your filters or search terms.
        </p>
        {onClearFilters && (
          <Button variant="secondary" onClick={onClearFilters}>
            Clear All Filters
          </Button>
        )}
      </div>
    </Card>
  )
}

/**
 * ClaimsListLoading - Loading skeleton
 */
function ClaimsListLoading() {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-4 h-4 bg-neutral-200 rounded" />
            <div className="flex-1 h-12 bg-neutral-200 rounded" />
            <div className="w-24 h-6 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </Card>
  )
}
