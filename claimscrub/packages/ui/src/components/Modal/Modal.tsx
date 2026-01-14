import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Modal Component
 *
 * Accessible dialog component built on Radix UI Dialog primitive.
 * Follows Denali Health design system specifications:
 * - Motion: 300ms ease-in-out for modal transitions
 * - Overlay: Semi-transparent slate background
 * - Focus: Trapped within modal when open
 * - Keyboard: Escape to close
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onOpenChange={setIsOpen}>
 *   <ModalContent>
 *     <ModalHeader>
 *       <ModalTitle>Confirm Action</ModalTitle>
 *     </ModalHeader>
 *     <ModalBody>Are you sure?</ModalBody>
 *     <ModalFooter>
 *       <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *       <Button variant="primary">Confirm</Button>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 * ```
 */

interface ModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

export function Modal({ children, open, onOpenChange, defaultOpen }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {children}
    </Dialog.Root>
  )
}

/**
 * ModalTrigger - Button or element that opens the modal
 */
export const ModalTrigger = Dialog.Trigger

/**
 * ModalContent - The modal container with overlay
 */
interface ModalContentProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function ModalContent({ children, className, size = 'md' }: ModalContentProps) {
  // Size mapping following design system spacing
  const sizeClasses = {
    sm: 'max-w-sm',      // 384px - Small dialogs, confirmations
    md: 'max-w-lg',      // 512px - Default, most modals
    lg: 'max-w-2xl',     // 672px - Forms, detailed content
    xl: 'max-w-4xl',     // 896px - Complex forms, tables
    full: 'max-w-[90vw]' // Full width - Large data displays
  }

  return (
    <Dialog.Portal>
      {/* Overlay with slate-900/50 background */}
      <Dialog.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-slate-900/50',
          // Animation: 300ms ease-in-out per design system
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
        )}
      />
      {/* Modal container */}
      <Dialog.Content
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%]',
          'bg-white rounded-xl shadow-lg',
          'border border-slate-200',
          // Animation: 300ms ease-in-out per design system
          'duration-300',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          // Focus management
          'focus:outline-none',
          sizeClasses[size],
          className
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}

/**
 * ModalHeader - Header section with close button
 */
interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function ModalHeader({ children, className, showCloseButton = true }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'px-6 py-4',
        'border-b border-slate-200',
        className
      )}
    >
      <div className="flex-1">{children}</div>
      {showCloseButton && (
        <Dialog.Close asChild>
          <button
            className={cn(
              'rounded-md p-1.5',
              'text-slate-500 hover:text-slate-700',
              'hover:bg-slate-100',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
            )}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </Dialog.Close>
      )}
    </div>
  )
}

/**
 * ModalTitle - Heading for the modal
 */
interface ModalTitleProps {
  children: React.ReactNode
  className?: string
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <Dialog.Title
      className={cn(
        'font-heading text-lg font-semibold text-slate-900',
        className
      )}
    >
      {children}
    </Dialog.Title>
  )
}

/**
 * ModalDescription - Descriptive text below title
 */
interface ModalDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function ModalDescription({ children, className }: ModalDescriptionProps) {
  return (
    <Dialog.Description
      className={cn(
        'text-sm text-slate-500 mt-1',
        className
      )}
    >
      {children}
    </Dialog.Description>
  )
}

/**
 * ModalBody - Main content area
 */
interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div
      className={cn(
        'px-6 py-4',
        'max-h-[60vh] overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * ModalFooter - Footer with action buttons
 */
interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3',
        'px-6 py-4',
        'border-t border-slate-200',
        'bg-slate-50 rounded-b-xl',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * ModalClose - Wrapper for close button functionality
 */
export const ModalClose = Dialog.Close
