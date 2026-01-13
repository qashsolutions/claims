import { cn } from '@claimscrub/ui'

interface Step {
  label: string
  completed: boolean
  active: boolean
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
              step.completed
                ? 'bg-success-500 text-white'
                : step.active
                  ? 'bg-warning-100 text-warning-800'
                  : 'bg-neutral-100 text-neutral-500'
            )}
          >
            {step.completed ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <span
            className={cn(
              'ml-2 text-body-sm font-medium',
              step.active ? 'text-warning-800' : step.completed ? 'text-success-700' : 'text-neutral-500'
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-4 h-px w-16',
                step.completed ? 'bg-success-500' : 'bg-neutral-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
