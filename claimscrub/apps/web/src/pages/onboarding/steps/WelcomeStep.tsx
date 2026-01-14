import { Check } from 'lucide-react'
import { Button } from '@claimscrub/ui'

/**
 * WelcomeStep - First step of onboarding
 *
 * Per design mockup: 08_onboarding.md - Step 1
 *
 * Introduces the onboarding process and what to expect.
 */

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const steps = [
    'Connect your Epic account (optional)',
    'Set up your practice profile',
    'Configure security (MFA)',
    'Validate your first claim',
  ]

  return (
    <div className="text-center">
      <h2 className="font-heading text-2xl font-bold text-neutral-900">
        Welcome to Denali Health
      </h2>
      <p className="mt-2 text-neutral-600">
        Let's get your account set up in 3 minutes.
      </p>

      <div className="mt-8 rounded-xl bg-neutral-50 p-6 text-left">
        <p className="font-semibold text-neutral-900 mb-4">What we'll do:</p>
        <ol className="space-y-3">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {idx + 1}
              </span>
              <span className="text-neutral-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <Button className="mt-8 w-full" onClick={onNext}>
        Get Started
      </Button>
    </div>
  )
}
