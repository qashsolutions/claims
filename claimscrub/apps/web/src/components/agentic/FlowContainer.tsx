import { useEffect } from 'react'
import { useFlow } from './FlowProvider'
import { ProgressSteps } from './ProgressSteps'
import { useTabEnterConfirm } from '@/hooks/useKeyboardNav'

interface FlowContainerProps {
  children: React.ReactNode
  onConfirm?: () => void
}

export function FlowContainer({ children, onConfirm }: FlowContainerProps) {
  const { currentStep, matches } = useFlow()

  // Tab+Enter keyboard shortcut
  useTabEnterConfirm(() => {
    onConfirm?.()
  }, !!onConfirm)

  const steps = [
    { label: 'Patient', completed: currentStep > 1, active: currentStep === 1 },
    { label: 'Procedure', completed: currentStep > 2, active: currentStep === 2 },
    { label: 'Diagnosis', completed: currentStep > 3, active: currentStep === 3 },
    { label: 'Auth', completed: currentStep > 4, active: currentStep === 4 },
    { label: 'Submit', completed: matches('success'), active: currentStep === 5 },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <ProgressSteps steps={steps} currentStep={currentStep} />
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        {children}
      </div>
    </div>
  )
}
