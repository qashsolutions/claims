import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Toast Notification Component
 *
 * Accessible toast notifications built on Radix UI Toast primitive.
 * Follows ClaimScrub design system semantic colors:
 * - success: Sage (green) - #dcfce7 bg, #16a34a border
 * - error: Rose (red) - #fee2e2 bg, #dc2626 border
 * - warning: Amber (yellow) - #fef3c7 bg, #d97706 border
 * - info: Slate (gray) - #f1f5f9 bg, #64748b border
 *
 * @example
 * ```tsx
 * const { toast } = useToast()
 * toast({ variant: 'success', title: 'Claim submitted', description: 'CLM-123 was submitted successfully' })
 * ```
 */

// Toast context for managing toasts globally
interface Toast {
  id: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  action?: React.ReactNode
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

/**
 * useToast Hook - Access toast functionality
 */
export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * ToastProvider - Wraps app to provide toast functionality
 */
interface ToastProviderProps {
  children: React.ReactNode
  // Position of toast viewport
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  // Default duration in ms
  duration?: number
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  duration = 5000
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  // Add a new toast
  const toast = React.useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...newToast, id, duration: newToast.duration ?? duration }])
  }, [duration])

  // Dismiss a specific toast
  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Dismiss all toasts
  const dismissAll = React.useCallback(() => {
    setToasts([])
  }, [])

  // Position classes for viewport
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
        {children}
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
        <ToastPrimitive.Viewport
          className={cn(
            'fixed z-[100] flex max-h-screen flex-col gap-2 p-4 w-full max-w-[420px]',
            positionClasses[position]
          )}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

/**
 * ToastItem - Individual toast notification
 */
interface ToastItemProps {
  toast: Toast
  onDismiss: () => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { variant = 'info', title, description, duration, action } = toast

  // Variant styles following design system semantic colors
  const variantStyles = {
    success: {
      container: 'bg-success-50 border-success-300',
      icon: <CheckCircle className="h-5 w-5 text-success-600" />,
      title: 'text-success-800',
      description: 'text-success-700',
    },
    error: {
      container: 'bg-error-50 border-error-300',
      icon: <XCircle className="h-5 w-5 text-error-600" />,
      title: 'text-error-800',
      description: 'text-error-700',
    },
    warning: {
      container: 'bg-warning-50 border-warning-300',
      icon: <AlertTriangle className="h-5 w-5 text-warning-600" />,
      title: 'text-warning-800',
      description: 'text-warning-700',
    },
    info: {
      container: 'bg-neutral-50 border-neutral-300',
      icon: <Info className="h-5 w-5 text-neutral-600" />,
      title: 'text-neutral-800',
      description: 'text-neutral-700',
    },
  }

  const styles = variantStyles[variant]

  return (
    <ToastPrimitive.Root
      duration={duration}
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
      className={cn(
        'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg',
        'transition-all duration-300',
        // Swipe animations
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
        'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
        // Enter/exit animations
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0',
        'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
        styles.container
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0">{styles.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <ToastPrimitive.Title className={cn('font-semibold text-sm', styles.title)}>
          {title}
        </ToastPrimitive.Title>
        {description && (
          <ToastPrimitive.Description className={cn('mt-1 text-sm', styles.description)}>
            {description}
          </ToastPrimitive.Description>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>

      {/* Close button */}
      <ToastPrimitive.Close
        className={cn(
          'absolute right-2 top-2 rounded-md p-1',
          'opacity-0 transition-opacity hover:opacity-100 focus:opacity-100',
          'group-hover:opacity-100',
          'focus:outline-none focus:ring-2 focus:ring-amber-500'
        )}
        aria-label="Close"
      >
        <X className="h-4 w-4 text-slate-500" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
}

/**
 * ToastAction - Action button within a toast
 */
interface ToastActionProps {
  children: React.ReactNode
  onClick?: () => void
  altText: string
}

export function ToastAction({ children, onClick, altText }: ToastActionProps) {
  return (
    <ToastPrimitive.Action asChild altText={altText}>
      <button
        onClick={onClick}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-3 py-1.5',
          'text-sm font-medium',
          'bg-white border border-slate-200',
          'hover:bg-slate-50',
          'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
          'transition-colors duration-150'
        )}
      >
        {children}
      </button>
    </ToastPrimitive.Action>
  )
}
