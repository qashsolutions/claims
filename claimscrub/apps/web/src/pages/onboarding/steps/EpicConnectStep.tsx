import { ExternalLink } from 'lucide-react'
import { Button, Card } from '@claimscrub/ui'

/**
 * EpicConnectStep - EHR integration step (optional)
 *
 * Per design mockup: 08_onboarding.md - Step 2
 *
 * Allows users to connect their Epic EHR for automatic
 * patient data retrieval. Can be skipped.
 */

interface EpicConnectStepProps {
  onNext: (data?: { epicConnected: boolean }) => void
  onBack: () => void
  onSkip?: () => void
}

export function EpicConnectStep({ onNext, onBack, onSkip }: EpicConnectStepProps) {
  const handleConnectEpic = async () => {
    // In production: initiate Epic OAuth flow
    // window.location.href = `${EPIC_OAUTH_URL}?client_id=${CLIENT_ID}&...`

    // For now, simulate successful connection
    onNext({ epicConnected: true })
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-neutral-900 text-center">
        Connect Your EHR
      </h2>
      <p className="mt-2 text-neutral-600 text-center">
        Connecting Epic allows you to pull patient data directly into claim validation.
      </p>

      <div className="mt-8 space-y-4">
        {/* Epic Card */}
        <Card className="p-6 border-2 border-primary-200 bg-primary-50">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
              <span className="font-bold text-primary-600">Epic</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">Connect Epic EHR</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Access patient demographics, diagnoses, and procedures directly from your EHR.
              </p>
              <Button className="mt-4" onClick={handleConnectEpic}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Epic
              </Button>
            </div>
          </div>
        </Card>

        {/* Other EHRs Coming Soon */}
        <Card className="p-6 bg-neutral-50">
          <p className="text-sm text-neutral-600">
            <span className="font-medium text-neutral-900">Other EHRs coming soon:</span>
            <br />
            Cerner | athenahealth | eClinicalWorks
          </p>
        </Card>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex items-center gap-3">
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Skip for Now
            </button>
          )}
          <Button onClick={() => onNext()}>Continue</Button>
        </div>
      </div>
    </div>
  )
}
