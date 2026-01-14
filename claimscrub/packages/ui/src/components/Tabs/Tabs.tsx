import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../utils/cn'

/**
 * Tabs Component
 *
 * Accessible tabs component built on Radix UI Tabs primitive.
 * Follows Denali Health design system tab navigation styles:
 * - Active: Amber-600 text, amber-600 bottom border
 * - Inactive: Slate-500 text, no border
 * - Hover: Slate-700 text
 *
 * Used extensively in:
 * - Validation Results page (Validation, Coverage, Documentation, History)
 * - Settings pages (Profile, Billing, Security)
 * - Claim detail view
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="validation">
 *   <TabsList>
 *     <TabsTrigger value="validation">Validation</TabsTrigger>
 *     <TabsTrigger value="coverage">Coverage</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="validation">Validation content...</TabsContent>
 *   <TabsContent value="coverage">Coverage content...</TabsContent>
 * </Tabs>
 * ```
 */

// Root Tabs container
interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  className?: string
}

export function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={cn('w-full', className)}
      {...props}
    />
  )
}

// TabsList - Container for tab triggers
interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  className?: string
  variant?: 'default' | 'underline' | 'pills'
}

export function TabsList({ className, variant = 'underline', ...props }: TabsListProps) {
  const variantClasses = {
    // Default: subtle background tabs
    default: 'bg-slate-100 p-1 rounded-lg',
    // Underline: bottom border style (per design system)
    underline: 'border-b border-slate-200',
    // Pills: rounded pill buttons
    pills: 'gap-2',
  }

  return (
    <TabsPrimitive.List
      className={cn(
        'flex items-center',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

// TabsTrigger - Individual tab button
interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  className?: string
  variant?: 'default' | 'underline' | 'pills'
}

export function TabsTrigger({ className, variant = 'underline', ...props }: TabsTriggerProps) {
  const variantClasses = {
    // Default: subtle background on active
    default: cn(
      'px-3 py-1.5 rounded-md',
      'text-sm font-medium',
      'text-slate-600',
      'transition-all duration-150',
      'hover:text-slate-900',
      'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm'
    ),
    // Underline: bottom border active indicator (per design system spec)
    underline: cn(
      'px-4 py-3',
      'text-sm font-medium',
      'text-slate-500',         // Inactive: slate-500 text
      'border-b-2 border-transparent',
      '-mb-px',                 // Overlap with list border
      'transition-colors duration-150',
      'hover:text-slate-700',   // Hover: slate-700 text
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      // Active: amber-600 text, amber-600 bottom border
      'data-[state=active]:text-primary-600 data-[state=active]:border-primary-600'
    ),
    // Pills: rounded pill buttons
    pills: cn(
      'px-4 py-2 rounded-full',
      'text-sm font-medium',
      'text-slate-600 bg-slate-100',
      'transition-all duration-150',
      'hover:bg-slate-200',
      'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-primary-600 data-[state=active]:text-white'
    ),
  }

  return (
    <TabsPrimitive.Trigger
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
}

// TabsContent - Content panel for each tab
interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  className?: string
}

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'mt-4',
        'focus:outline-none',
        // Animation for tab content
        'data-[state=inactive]:hidden',
        'data-[state=active]:animate-in',
        'data-[state=active]:fade-in-0',
        'data-[state=active]:zoom-in-95',
        className
      )}
      {...props}
    />
  )
}
