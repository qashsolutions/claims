/**
 * Keyboard navigation utilities for agentic Tab+Enter UX
 */

export type KeyHandler = (event: KeyboardEvent) => void

export interface KeyBinding {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: KeyHandler
}

export function matchesBinding(event: KeyboardEvent, binding: KeyBinding): boolean {
  return (
    event.key === binding.key &&
    !!event.ctrlKey === !!binding.ctrl &&
    !!event.shiftKey === !!binding.shift &&
    !!event.altKey === !!binding.alt &&
    !!event.metaKey === !!binding.meta
  )
}

export function createKeyboardHandler(bindings: KeyBinding[]): KeyHandler {
  return (event: KeyboardEvent) => {
    for (const binding of bindings) {
      if (matchesBinding(event, binding)) {
        event.preventDefault()
        binding.handler(event)
        return
      }
    }
  }
}

/**
 * Standard bindings for agentic flow
 */
export const FLOW_BINDINGS = {
  confirm: { key: 'Enter' },
  back: { key: 'Escape' },
  next: { key: 'Tab' },
  previous: { key: 'Tab', shift: true },
  submit: { key: 'Enter', ctrl: true },
}

/**
 * Check if Tab+Enter pattern is detected
 */
export function isTabEnterPattern(events: KeyboardEvent[]): boolean {
  if (events.length < 2) return false
  const last = events[events.length - 1]
  const secondLast = events[events.length - 2]
  return (
    secondLast?.key === 'Tab' &&
    last?.key === 'Enter' &&
    last.timeStamp - secondLast.timeStamp < 500
  )
}
