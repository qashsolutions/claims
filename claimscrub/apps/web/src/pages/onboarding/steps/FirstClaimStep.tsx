import { Check, Plus, Upload, HelpCircle, LayoutDashboard } from 'lucide-react'
import { Card } from '@claimscrub/ui'

/**
 * FirstClaimStep - Onboarding completion (final step)
 *
 * Per design mockup: 08_onboarding.md - Step 5
 *
 * Shows:
 * - Success confirmation
 * - Free trial benefits
 * - Quick action cards for next steps
 */

interface FirstClaimStepProps {
  onComplete: (action: string) => void
}

const FREE_TRIAL_BENEFITS = [
  '7 days of access',
  '1 claim validation per day',
  'All 4 specialty validations',
  'CPT-ICD, NPI, and CMS coverage checks',
]

const ACTION_CARDS = [
  {
    id: 'create-claim',
    icon: Plus,
    label: 'Create a Claim',
    description: 'Start validating',
  },
  {
    id: 'upload-837',
    icon: Upload,
    label: 'Upload 837 File',
    description: 'Batch validation',
  },
  {
    id: 'tour',
    icon: HelpCircle,
    label: 'Take a Tour',
    description: 'Learn the basics',
  },
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Go to Dashboard',
    description: 'Start exploring',
  },
]

export function FirstClaimStep({ onComplete }: FirstClaimStepProps) {
  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-success-600" />
        </div>
      </div>

      <h2 className="font-heading text-2xl font-bold text-neutral-900">
        You're All Set!
      </h2>
      <p className="mt-2 text-neutral-600">
        Account setup complete
      </p>

      {/* Free Trial Benefits */}
      <Card className="mt-8 p-6 bg-primary-50 border-primary-200 text-left">
        <p className="font-semibold text-primary-900 mb-4">
          Your free trial includes:
        </p>
        <ul className="space-y-2">
          {FREE_TRIAL_BENEFITS.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-primary-600" />
              <span className="text-primary-800">{benefit}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Cards */}
      <div className="mt-8">
        <p className="text-neutral-700 mb-4">What would you like to do first?</p>
        <div className="grid grid-cols-2 gap-4">
          {ACTION_CARDS.map((action) => (
            <button
              key={action.id}
              onClick={() => onComplete(action.id)}
              className="flex flex-col items-center p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <action.icon className="h-6 w-6 text-neutral-600 mb-2" />
              <span className="font-medium text-neutral-900">{action.label}</span>
              <span className="text-xs text-neutral-500">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
