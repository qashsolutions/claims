import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Dropdown Menu Component
 *
 * Accessible dropdown menu built on Radix UI DropdownMenu primitive.
 * Used for contextual actions, navigation menus, and option selection.
 *
 * Follows ClaimScrub design system:
 * - White background with slate-200 border
 * - 8px border radius
 * - Hover: slate-100 background
 * - Animation: 200ms ease-in-out
 *
 * Common uses:
 * - User avatar menu (profile, settings, logout)
 * - Row action menus in tables
 * - Bulk action dropdowns
 * - More options (...)
 *
 * @example
 * ```tsx
 * <Dropdown>
 *   <DropdownTrigger asChild>
 *     <Button variant="ghost"><MoreVertical /></Button>
 *   </DropdownTrigger>
 *   <DropdownContent>
 *     <DropdownItem onClick={() => editClaim(id)}>Edit</DropdownItem>
 *     <DropdownItem onClick={() => viewDetails(id)}>View Details</DropdownItem>
 *     <DropdownSeparator />
 *     <DropdownItem variant="danger" onClick={() => deleteClaim(id)}>Delete</DropdownItem>
 *   </DropdownContent>
 * </Dropdown>
 * ```
 */

// Root dropdown
export const Dropdown = DropdownMenuPrimitive.Root
export const DropdownTrigger = DropdownMenuPrimitive.Trigger
export const DropdownGroup = DropdownMenuPrimitive.Group
export const DropdownPortal = DropdownMenuPrimitive.Portal
export const DropdownSub = DropdownMenuPrimitive.Sub
export const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup

// DropdownContent - The menu panel
interface DropdownContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  className?: string
}

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden',
        'rounded-lg border border-slate-200 bg-white p-1 shadow-md',
        // Animation: 200ms ease-in-out per design system
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownContent.displayName = 'DropdownContent'

// DropdownItem - Individual menu item
interface DropdownItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  className?: string
  variant?: 'default' | 'danger'
  inset?: boolean
}

export const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(({ className, variant = 'default', inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5',
      'text-sm outline-none',
      'transition-colors duration-150',
      // Focus/hover state
      'focus:bg-slate-100',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      // Variant styles
      variant === 'default' && 'text-slate-700 focus:text-slate-900',
      variant === 'danger' && 'text-rose-600 focus:bg-rose-50 focus:text-rose-700',
      // Inset for items following a checkbox/radio
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownItem.displayName = 'DropdownItem'

// DropdownCheckboxItem - Checkbox item
interface DropdownCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {
  className?: string
}

export const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2',
      'text-sm text-slate-700 outline-none',
      'transition-colors duration-150',
      'focus:bg-slate-100 focus:text-slate-900',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary-600" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownCheckboxItem.displayName = 'DropdownCheckboxItem'

// DropdownRadioItem - Radio item
interface DropdownRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> {
  className?: string
}

export const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2',
      'text-sm text-slate-700 outline-none',
      'transition-colors duration-150',
      'focus:bg-slate-100 focus:text-slate-900',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-primary-600" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownRadioItem.displayName = 'DropdownRadioItem'

// DropdownLabel - Section label
interface DropdownLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
  className?: string
  inset?: boolean
}

export const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownLabel.displayName = 'DropdownLabel'

// DropdownSeparator - Visual divider
interface DropdownSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {
  className?: string
}

export const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-slate-200', className)}
    {...props}
  />
))
DropdownSeparator.displayName = 'DropdownSeparator'

// DropdownShortcut - Keyboard shortcut display
interface DropdownShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

export function DropdownShortcut({ className, ...props }: DropdownShortcutProps) {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-slate-400',
        className
      )}
      {...props}
    />
  )
}

// DropdownSubTrigger - Trigger for submenu
interface DropdownSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> {
  className?: string
  inset?: boolean
}

export const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center rounded-md px-2 py-1.5',
      'text-sm text-slate-700 outline-none',
      'transition-colors duration-150',
      'focus:bg-slate-100 focus:text-slate-900',
      'data-[state=open]:bg-slate-100',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownSubTrigger.displayName = 'DropdownSubTrigger'

// DropdownSubContent - Content for submenu
interface DropdownSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {
  className?: string
}

export const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownSubContentProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden',
      'rounded-lg border border-slate-200 bg-white p-1 shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
DropdownSubContent.displayName = 'DropdownSubContent'
