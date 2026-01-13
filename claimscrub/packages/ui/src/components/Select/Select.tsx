import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Select Component
 *
 * Accessible select/dropdown component built on Radix UI Select primitive.
 * Follows ClaimScrub design system form input styles:
 * - Default: white bg, slate-300 border, 6px radius
 * - Focus: amber-500 border, amber-100 ring
 * - Error: rose-500 border, rose-100 ring
 *
 * Features:
 * - Searchable option for large lists (ICD codes, CPT codes)
 * - Grouped options support
 * - Full keyboard navigation
 * - Screen reader accessible
 *
 * @example
 * ```tsx
 * <Select value={code} onValueChange={setCode}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select ICD-10 code" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectGroup>
 *       <SelectLabel>Oncology</SelectLabel>
 *       <SelectItem value="C50.911">C50.911 - Breast cancer</SelectItem>
 *       <SelectItem value="C34.90">C34.90 - Lung cancer</SelectItem>
 *     </SelectGroup>
 *   </SelectContent>
 * </Select>
 * ```
 */

// Root Select
export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectGroup = SelectPrimitive.Group

// SelectTrigger - The button that opens the select
interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  className?: string
  error?: boolean
}

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, error, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between gap-2',
      'rounded-md border bg-white px-3 py-2',
      'text-sm',
      // Default state
      'border-slate-300',
      // Placeholder styling
      'data-[placeholder]:text-slate-400',
      // Focus state (amber per design system)
      'focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500',
      // Disabled state
      'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400',
      // Error state
      error && 'border-rose-500 focus:ring-rose-100 focus:border-rose-500',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

// SelectContent - The dropdown panel
interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  className?: string
}

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden',
        'rounded-md border border-slate-200 bg-white shadow-md',
        // Animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        // Positioning adjustments for popper
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

// SelectLabel - Group label
interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  className?: string
}

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide',
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

// SelectItem - Individual option
interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  className?: string
}

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center',
      'rounded-md py-2 pl-8 pr-2',
      'text-sm text-slate-900',
      'outline-none',
      // Focus/hover state
      'focus:bg-slate-100 focus:text-slate-900',
      'data-[highlighted]:bg-slate-100',
      // Disabled state
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    {/* Checkmark indicator */}
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

// SelectSeparator - Visual divider between groups
interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {
  className?: string
}

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-slate-200', className)}
    {...props}
  />
))
SelectSeparator.displayName = 'SelectSeparator'

// Scroll buttons for long lists
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4 text-slate-500" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = 'SelectScrollUpButton'

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 text-slate-500" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = 'SelectScrollDownButton'

/**
 * SearchableSelect - Select with search/filter capability
 *
 * Used for large code lists (ICD-10, CPT, etc.)
 */
interface SearchableSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  options: Array<{ value: string; label: string; group?: string }>
  error?: boolean
  disabled?: boolean
  className?: string
}

export function SearchableSelect({
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  options,
  error,
  disabled,
  className,
}: SearchableSelectProps) {
  const [search, setSearch] = React.useState('')

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    const lowerSearch = search.toLowerCase()
    return options.filter(
      (opt) =>
        opt.value.toLowerCase().includes(lowerSearch) ||
        opt.label.toLowerCase().includes(lowerSearch)
    )
  }, [options, search])

  // Group options
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, typeof options> = {}
    filteredOptions.forEach((opt) => {
      const group = opt.group || 'Other'
      if (!groups[group]) groups[group] = []
      groups[group].push(opt)
    })
    return groups
  }, [filteredOptions])

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className} error={error}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Search input */}
        <div className="px-2 py-2 border-b border-slate-200">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-slate-50 border border-slate-200">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              // Prevent select from closing when typing
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Options grouped */}
        {Object.entries(groupedOptions).map(([group, items]) => (
          <SelectGroup key={group}>
            {Object.keys(groupedOptions).length > 1 && (
              <SelectLabel>{group}</SelectLabel>
            )}
            {items.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}

        {/* No results */}
        {filteredOptions.length === 0 && (
          <div className="py-6 text-center text-sm text-slate-500">
            No results found
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
