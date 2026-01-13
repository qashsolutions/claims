import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../utils/cn'

/**
 * Tooltip Component
 *
 * Accessible tooltip component built on Radix UI Tooltip primitive.
 * Used for providing contextual information without cluttering the UI.
 *
 * Follows ClaimScrub design system:
 * - Slate-900 background with white text (dark tooltip)
 * - 6px border radius
 * - Arrow pointing to trigger
 * - 150ms delay to prevent accidental triggering
 *
 * Common uses:
 * - Explaining denial codes (CO-11, CO-15, etc.)
 * - Providing additional context for CPT/ICD codes
 * - Help text for form fields
 * - Icon button labels
 *
 * @example
 * ```tsx
 * <Tooltip content="CO-11: Diagnosis inconsistent with procedure">
 *   <Badge variant="error">CO-11</Badge>
 * </Tooltip>
 * ```
 */

// Provider must wrap the app to enable tooltips
export const TooltipProvider = TooltipPrimitive.Provider

// Root tooltip component
interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
  // For controlled mode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 150,
  className,
  open,
  onOpenChange,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      delayDuration={delayDuration}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={4}
          className={cn(
            'z-50 overflow-hidden',
            'rounded-md px-3 py-1.5',
            'bg-slate-900 text-white',
            'text-xs font-medium',
            'shadow-md',
            // Animation
            'animate-in fade-in-0 zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            className
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-slate-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

/**
 * InfoTooltip - Tooltip with info icon trigger
 *
 * Used for inline help text without a custom trigger element.
 */
import { Info } from 'lucide-react'

interface InfoTooltipProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  iconClassName?: string
}

export function InfoTooltip({ content, side = 'top', iconClassName }: InfoTooltipProps) {
  return (
    <Tooltip content={content} side={side}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-full p-0.5',
          'text-slate-400 hover:text-slate-600',
          'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
          'transition-colors duration-150'
        )}
      >
        <Info className={cn('h-4 w-4', iconClassName)} />
        <span className="sr-only">More information</span>
      </button>
    </Tooltip>
  )
}

/**
 * CodeTooltip - Specialized tooltip for medical codes
 *
 * Displays formatted code information with code, description, and optional metadata.
 */
interface CodeTooltipProps {
  code: string
  description: string
  type?: 'ICD-10' | 'CPT' | 'HCPCS' | 'NDC'
  metadata?: Record<string, string>
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function CodeTooltip({
  code,
  description,
  type,
  metadata,
  children,
  side = 'top',
}: CodeTooltipProps) {
  return (
    <Tooltip
      side={side}
      content={
        <div className="max-w-xs space-y-1">
          <div className="flex items-center gap-2">
            {type && (
              <span className="text-xs text-slate-400">{type}</span>
            )}
            <span className="font-mono font-semibold">{code}</span>
          </div>
          <p className="text-slate-200">{description}</p>
          {metadata && (
            <div className="pt-1 border-t border-slate-700 space-y-0.5">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-400">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}
