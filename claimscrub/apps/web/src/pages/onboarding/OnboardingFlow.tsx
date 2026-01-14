import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WelcomeStep } from './steps/WelcomeStep'
import { EpicConnectStep } from './steps/EpicConnectStep'
import { PracticeProfileStep } from './steps/PracticeProfileStep'
import { MFASetupStep } from './steps/MFASetupStep'
import { FirstClaimStep } from './steps/FirstClaimStep'

/**
 * OnboardingFlow - Multi-step onboarding wizard
 *
 * Per design mockup: 08_onboarding.md
 *
 * Steps:
 * 1. Welcome - Introduction
 * 2. Epic Connect - EHR integration (optional)
 * 3. Practice Profile - Practice details (required)
 * 4. MFA Setup - Two-factor auth (required for HIPAA)
 * 5. First Claim - Success and next steps
 */

const STEPS = [
  { id: 'welcome', label: 'Welcome', component: WelcomeStep, canSkip: false },
  { id: 'epic', label: 'Connect EHR', component: EpicConnectStep, canSkip: true },
  { id: 'profile', label: 'Practice', component: PracticeProfileStep, canSkip: false },
  { id: 'mfa', label: 'Security', component: MFASetupStep, canSkip: false },
  { id: 'complete', label: 'Complete', component: FirstClaimStep, canSkip: false },
]

interface OnboardingData {
  epicConnected: boolean
  practiceName: string
  specialty: string
  npi: string
  role: string
  mfaEnabled: boolean
}

export function OnboardingFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    epicConnected: false,
    practiceName: '',
    specialty: '',
    npi: '',
    role: '',
    mfaEnabled: false,
  })

  const step = STEPS[currentStep]!
  const StepComponent = step.component

  const handleNext = (stepData?: Partial<OnboardingData>) => {
    if (stepData) {
      setData((prev) => ({ ...prev, ...stepData }))
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    if (step.canSkip) {
      handleNext()
    }
  }

  const handleComplete = (action: string) => {
    // Navigate based on user's choice
    switch (action) {
      case 'create-claim':
        navigate('/claims/new')
        break
      case 'upload-837':
        navigate('/claims?upload=true')
        break
      case 'tour':
        navigate('/dashboard?tour=true')
        break
      case 'dashboard':
      default:
        navigate('/dashboard')
        break
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary-900">
          Denali Health
        </h1>
      </div>

      {/* Step Container */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <StepComponent
          data={data}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={step.canSkip ? handleSkip : undefined}
          onComplete={handleComplete}
        />
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 flex items-center gap-3">
        {STEPS.map((s, idx) => (
          <div
            key={s.id}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
              idx < currentStep
                ? 'border-primary-600 bg-primary-600 text-white'
                : idx === currentStep
                ? 'border-primary-600 bg-white text-primary-600'
                : 'border-neutral-300 bg-white text-neutral-400'
            )}
          >
            {idx < currentStep ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="text-sm font-semibold">{idx + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
