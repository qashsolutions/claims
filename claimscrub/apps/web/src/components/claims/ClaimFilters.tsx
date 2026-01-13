import { useState } from 'react'
import { Filter, X, Search, Calendar, DollarSign } from 'lucide-react'
import { Button, Card, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * ClaimFilters Component
 *
 * Filter panel for claims list with multiple filter options.
 * Per design mockup 07_claims_list.md:
 *
 * Filters:
 * - Status tabs (All, Pass, Warning, Failed, Pending)
 * - Date range
 * - Payer
 * - Specialty
 * - Provider
 * - Denial risk codes
 * - Charge amount range
 *
 * @example
 * ```tsx
 * <ClaimFilters
 *   filters={filters}
 *   onFilterChange={setFilters}
 *   counts={{ all: 47, pass: 32, warning: 10, fail: 5 }}
 * />
 * ```
 */

export interface ClaimFilterValues {
  status?: 'all' | 'pass' | 'warning' | 'fail' | 'pending'
  search?: string
  dateFrom?: string
  dateTo?: string
  payer?: string
  specialty?: string
  provider?: string
  denialCodes?: string[]
  chargeMin?: number
  chargeMax?: number
  sortBy?: string
}

interface ClaimFiltersProps {
  filters: ClaimFilterValues
  onFilterChange: (filters: ClaimFilterValues) => void
  counts?: {
    all: number
    pass: number
    warning: number
    fail: number
    pending: number
  }
  payers?: Array<{ id: string; name: string }>
  specialties?: Array<{ id: string; name: string }>
  providers?: Array<{ id: string; name: string }>
  className?: string
}

export function ClaimFilters({
  filters,
  onFilterChange,
  counts = { all: 0, pass: 0, warning: 0, fail: 0, pending: 0 },
  payers = [],
  specialties = [],
  providers = [],
  className,
}: ClaimFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Update single filter value
  const updateFilter = (key: keyof ClaimFilterValues, value: any) => {
    onFilterChange({ ...filters, [key]: value })
  }

  // Clear all filters
  const clearFilters = () => {
    onFilterChange({ status: 'all', sortBy: 'newest' })
  }

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.payer ||
    filters.specialty ||
    filters.provider ||
    (filters.denialCodes && filters.denialCodes.length > 0) ||
    filters.chargeMin ||
    filters.chargeMax
  )

  // Denial code options
  const denialCodeOptions = [
    { code: 'CO-11', label: 'Diagnosis Mismatch' },
    { code: 'CO-15', label: 'Auth Required' },
    { code: 'CO-16', label: 'Missing Info' },
    { code: 'CO-4', label: 'Modifier Issue' },
    { code: 'CO-29', label: 'Timely Filing' },
    { code: 'CO-50', label: 'Not Medically Necessary' },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Status Tabs */}
      <Card className="p-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <StatusTab
            label="All"
            count={counts.all}
            active={filters.status === 'all' || !filters.status}
            onClick={() => updateFilter('status', 'all')}
          />
          <StatusTab
            label="Pass"
            count={counts.pass}
            variant="success"
            active={filters.status === 'pass'}
            onClick={() => updateFilter('status', 'pass')}
          />
          <StatusTab
            label="Warning"
            count={counts.warning}
            variant="warning"
            active={filters.status === 'warning'}
            onClick={() => updateFilter('status', 'warning')}
          />
          <StatusTab
            label="Failed"
            count={counts.fail}
            variant="error"
            active={filters.status === 'fail'}
            onClick={() => updateFilter('status', 'fail')}
          />
          <StatusTab
            label="Pending"
            count={counts.pending}
            variant="default"
            active={filters.status === 'pending'}
            onClick={() => updateFilter('status', 'pending')}
          />

          {/* Filter Toggle */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant={showAdvanced ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                  !
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Sort */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by patient name, claim ID, or CPT code..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-md border border-neutral-300',
                'text-sm placeholder:text-neutral-400',
                'focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500'
              )}
            />
          </div>

          {/* Sort Select */}
          <Select
            value={filters.sortBy || 'newest'}
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="patient-az">Patient A-Z</SelectItem>
              <SelectItem value="patient-za">Patient Z-A</SelectItem>
              <SelectItem value="charge-high">Highest charge</SelectItem>
              <SelectItem value="charge-low">Lowest charge</SelectItem>
              <SelectItem value="status-fail">Status (Failed first)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-neutral-900">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  className="flex-1"
                />
                <span className="text-neutral-400">-</span>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Payer */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Payer
              </label>
              <Select
                value={filters.payer || 'all'}
                onValueChange={(value) => updateFilter('payer', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Payers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payers</SelectItem>
                  {payers.map((payer) => (
                    <SelectItem key={payer.id} value={payer.id}>
                      {payer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Specialty
              </label>
              <Select
                value={filters.specialty || 'all'}
                onValueChange={(value) => updateFilter('specialty', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provider */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Provider
              </label>
              <Select
                value={filters.provider || 'all'}
                onValueChange={(value) => updateFilter('provider', value === 'all' ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map((prov) => (
                    <SelectItem key={prov.id} value={prov.id}>
                      {prov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Denial Codes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Denial Risk
              </label>
              <div className="space-y-2">
                {denialCodeOptions.map((option) => (
                  <label key={option.code} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.denialCodes?.includes(option.code) || false}
                      onChange={(e) => {
                        const current = filters.denialCodes || []
                        const updated = e.target.checked
                          ? [...current, option.code]
                          : current.filter((c) => c !== option.code)
                        updateFilter('denialCodes', updated.length ? updated : undefined)
                      }}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">
                      <span className="font-mono">{option.code}</span>
                      <span className="text-neutral-500 ml-1">- {option.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Charge Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Charge Amount
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.chargeMin || ''}
                    onChange={(e) => updateFilter('chargeMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="pl-7"
                  />
                </div>
                <span className="text-neutral-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.chargeMax || ''}
                    onChange={(e) => updateFilter('chargeMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <Button onClick={() => setShowAdvanced(false)}>
              Apply Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

/**
 * StatusTab - Individual status filter tab
 */
interface StatusTabProps {
  label: string
  count: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  active?: boolean
  onClick?: () => void
}

function StatusTab({ label, count, variant = 'default', active, onClick }: StatusTabProps) {
  const variantStyles = {
    default: active ? 'bg-neutral-200' : 'hover:bg-neutral-100',
    success: active ? 'bg-success-100 text-success-700' : 'hover:bg-success-50',
    warning: active ? 'bg-warning-100 text-warning-700' : 'hover:bg-warning-50',
    error: active ? 'bg-error-100 text-error-700' : 'hover:bg-error-50',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-md',
        'text-sm font-medium transition-colors',
        active ? 'text-neutral-900' : 'text-neutral-600',
        variantStyles[variant]
      )}
    >
      {label}
      <span className={cn(
        'px-1.5 py-0.5 rounded text-xs',
        active ? 'bg-white/60' : 'bg-neutral-100'
      )}>
        {count}
      </span>
    </button>
  )
}

/**
 * ClaimBulkActions - Bulk action bar when claims are selected
 */
interface ClaimBulkActionsProps {
  selectedCount: number
  onExport?: () => void
  onRevalidate?: () => void
  onDelete?: () => void
  onDeselectAll?: () => void
  className?: string
}

export function ClaimBulkActions({
  selectedCount,
  onExport,
  onRevalidate,
  onDelete,
  onDeselectAll,
  className,
}: ClaimBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">
          {selectedCount} claim{selectedCount !== 1 ? 's' : ''} selected
        </span>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onExport}>
            Export Selected
          </Button>
          <Button variant="secondary" size="sm" onClick={onRevalidate}>
            Revalidate
          </Button>
          <Button variant="secondary" size="sm" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={onDeselectAll}>
            <X className="h-4 w-4 mr-1" />
            Deselect All
          </Button>
        </div>
      </div>
    </Card>
  )
}
