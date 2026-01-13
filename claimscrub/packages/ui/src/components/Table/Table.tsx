import * as React from 'react'
import { cn } from '../../utils/cn'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

/**
 * Table Component
 *
 * Accessible data table component for displaying claims, validations, etc.
 * Follows ClaimScrub design system card/container styles:
 * - White bg, slate-200 border, 8px radius
 * - Sortable columns with visual indicators
 * - Selectable rows for bulk actions
 *
 * Used in:
 * - Claims list page
 * - Validation history
 * - User management (settings)
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead sortable sortDirection="asc">Claim ID</TableHead>
 *       <TableHead>Patient</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     {claims.map(claim => (
 *       <TableRow key={claim.id}>
 *         <TableCell>{claim.id}</TableCell>
 *         <TableCell>{claim.patientName}</TableCell>
 *         <TableCell><StatusBadge status={claim.status} /></TableCell>
 *       </TableRow>
 *     ))}
 *   </TableBody>
 * </Table>
 * ```
 */

// Table container
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto rounded-lg border border-slate-200">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

// Table header section
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn('bg-slate-50 border-b border-slate-200', className)}
      {...props}
    />
  )
}

// Table body section
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

// Table footer section
interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn(
        'border-t border-slate-200 bg-slate-50 font-medium',
        className
      )}
      {...props}
    />
  )
}

// Table row
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
  selected?: boolean
  clickable?: boolean
}

export function TableRow({ className, selected, clickable, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-slate-200 transition-colors',
        // Hover state
        'hover:bg-slate-50',
        // Selected state
        selected && 'bg-primary-50 hover:bg-primary-100',
        // Clickable row styling
        clickable && 'cursor-pointer',
        className
      )}
      {...props}
    />
  )
}

// Table header cell
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
}

export function TableHead({
  className,
  children,
  sortable,
  sortDirection,
  onSort,
  ...props
}: TableHeadProps) {
  // Sort icon based on current direction
  const SortIcon = () => {
    if (!sortable) return null
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-primary-600" />
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 text-primary-600" />
    }
    return <ChevronsUpDown className="h-4 w-4 text-slate-400" />
  }

  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-semibold text-slate-700',
        sortable && 'cursor-pointer select-none hover:text-slate-900',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        <SortIcon />
      </div>
    </th>
  )
}

// Table data cell
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn('px-4 py-3 align-middle text-slate-900', className)}
      {...props}
    />
  )
}

// Table caption
interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string
}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn('mt-4 text-sm text-slate-500', className)}
      {...props}
    />
  )
}

/**
 * TableEmpty - Empty state display
 */
interface TableEmptyProps {
  children?: React.ReactNode
  colSpan: number
  className?: string
}

export function TableEmpty({ children, colSpan, className }: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn(
          'h-32 text-center text-sm text-slate-500',
          className
        )}
      >
        {children || 'No data available'}
      </td>
    </tr>
  )
}

/**
 * TableLoading - Loading state with skeleton rows
 */
interface TableLoadingProps {
  colSpan: number
  rows?: number
}

export function TableLoading({ colSpan, rows = 5 }: TableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-200">
          {Array.from({ length: colSpan }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-slate-200 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

/**
 * TablePagination - Pagination controls
 */
interface TablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50 rounded-b-lg">
      {/* Results info */}
      <div className="text-sm text-slate-600">
        Showing <span className="font-medium">{start}</span> to{' '}
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </div>

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="rounded-md px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-slate-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-md px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}
