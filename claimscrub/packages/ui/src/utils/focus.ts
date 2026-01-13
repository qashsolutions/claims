/**
 * Focus management utilities for keyboard navigation
 */

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(selector))
}

export function focusFirstElement(container: HTMLElement): void {
  const elements = getFocusableElements(container)
  elements[0]?.focus()
}

export function focusLastElement(container: HTMLElement): void {
  const elements = getFocusableElements(container)
  elements[elements.length - 1]?.focus()
}

export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  const elements = getFocusableElements(container)
  const first = elements[0]
  const last = elements[elements.length - 1]

  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }
}

export function focusNextElement(container: HTMLElement): void {
  const elements = getFocusableElements(container)
  const currentIndex = elements.findIndex((el) => el === document.activeElement)
  const nextIndex = (currentIndex + 1) % elements.length
  elements[nextIndex]?.focus()
}

export function focusPreviousElement(container: HTMLElement): void {
  const elements = getFocusableElements(container)
  const currentIndex = elements.findIndex((el) => el === document.activeElement)
  const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1
  elements[prevIndex]?.focus()
}
