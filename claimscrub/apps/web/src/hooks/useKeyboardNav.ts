import { useEffect, useCallback, useRef } from 'react'
import type { KeyBinding } from '@/lib/keyboard'
import { matchesBinding } from '@/lib/keyboard'

interface UseKeyboardNavOptions {
  bindings: KeyBinding[]
  enabled?: boolean
}

export function useKeyboardNav({ bindings, enabled = true }: UseKeyboardNavOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Skip if user is typing in an input
      const target = event.target as HTMLElement
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      const isContentEditable = target.isContentEditable

      // Allow Tab and Enter even in inputs for flow navigation
      const isFlowKey = event.key === 'Tab' || event.key === 'Enter'
      if ((isInput || isContentEditable) && !isFlowKey) return

      for (const binding of bindings) {
        if (matchesBinding(event, binding)) {
          event.preventDefault()
          binding.handler(event)
          return
        }
      }
    },
    [bindings, enabled]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Hook for Tab+Enter confirmation pattern
 */
export function useTabEnterConfirm(onConfirm: () => void, enabled = true) {
  const lastTabTime = useRef<number>(0)

  useKeyboardNav({
    bindings: [
      {
        key: 'Tab',
        handler: () => {
          lastTabTime.current = Date.now()
        },
      },
      {
        key: 'Enter',
        handler: () => {
          const timeSinceTab = Date.now() - lastTabTime.current
          if (timeSinceTab < 500) {
            onConfirm()
          }
        },
      },
    ],
    enabled,
  })
}
