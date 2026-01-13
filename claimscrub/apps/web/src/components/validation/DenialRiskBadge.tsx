import { useState } from 'react'
import { AlertTriangle, Info } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * DenialRiskBadge Component
 *
 * Displays a denial code risk indicator with clickable modal for details.
 * Per design mockup 04_validation_results.md - Denial Code Reference Modal.
 *
 * Common denial codes (from CARC - Claim Adjustment Reason Codes):
 * - CO-11: Diagnosis inconsistent with procedure
 * - CO-15: Authorization not obtained
 * - CO-16: Claim/service lacks information
 * - CO-18: Duplicate claim/service
 * - CO-29: Time limit for filing exceeded
 * - CO-50: Services not deemed medically necessary
 * - CO-96: Non-covered charge(s)
 * - CO-97: Payment adjusted (bundling)
 *
 * @example
 * ```tsx
 * <DenialRiskBadge
 *   code="CO-11"
 *   description="Diagnosis inconsistent with procedure"
 * />
 * ```
 */

interface DenialRiskBadgeProps {
  code: string
  description?: string
  className?: string
}

// Denial code database with detailed information
const DENIAL_CODE_INFO: Record<string, {
  title: string
  description: string
  commonCauses: string[]
  prevention: string[]
  appealSuccessRate?: number
}> = {
  'CO-11': {
    title: 'Diagnosis Inconsistent with Procedure',
    description: 'The diagnosis provided does not support the medical necessity of the procedure billed.',
    commonCauses: [
      'Wrong ICD-10 code selected',
      'Diagnosis doesn\'t match specialty',
      'Missing secondary diagnosis',
    ],
    prevention: [
      'Verify ICD-10 codes match procedure type',
      'Include all relevant diagnoses',
      'Document medical necessity clearly',
    ],
    appealSuccessRate: 62,
  },
  'CO-15': {
    title: 'Authorization Not Obtained',
    description: 'The procedure or service requires prior authorization that was not obtained before the service was rendered.',
    commonCauses: [
      'Prior auth not requested before service',
      'Auth number not included on claim',
      'Auth expired at time of service',
      'Service not covered under existing auth',
    ],
    prevention: [
      'Check payer auth requirements before scheduling',
      'Verify auth is active and covers service dates',
      'Include auth number on all claims',
      'Track auth unit limits for ongoing treatments',
    ],
    appealSuccessRate: 45,
  },
  'CO-16': {
    title: 'Claim Lacks Required Information',
    description: 'The claim is missing information that is needed for adjudication.',
    commonCauses: [
      'Missing or invalid NPI',
      'Incomplete patient demographics',
      'Missing required modifiers',
      'No supporting documentation',
    ],
    prevention: [
      'Complete all required fields before submission',
      'Validate data completeness',
      'Include all necessary modifiers',
    ],
    appealSuccessRate: 78,
  },
  'CO-18': {
    title: 'Duplicate Claim or Service',
    description: 'This claim or service has already been paid or is under review for another claim.',
    commonCauses: [
      'Claim resubmitted without corrected claim indicator',
      'Same service billed by multiple providers',
      'Incorrect date of service',
    ],
    prevention: [
      'Check claim status before resubmitting',
      'Use corrected claim indicator (frequency code 7)',
      'Verify date of service accuracy',
    ],
    appealSuccessRate: 55,
  },
  'CO-29': {
    title: 'Timely Filing Limit Exceeded',
    description: 'The claim was received after the filing deadline for the payer.',
    commonCauses: [
      'Claim not submitted within payer deadline',
      'Initial claim rejection not addressed in time',
      'Appeals deadline missed',
    ],
    prevention: [
      'Know payer-specific filing deadlines',
      'Submit claims within 48 hours of service',
      'Monitor rejected claims daily',
    ],
    appealSuccessRate: 15,
  },
  'CO-50': {
    title: 'Services Not Medically Necessary',
    description: 'The payer determined the service was not medically necessary based on the information provided.',
    commonCauses: [
      'Insufficient documentation',
      'Service frequency exceeds coverage limits',
      'Diagnosis doesn\'t support necessity',
    ],
    prevention: [
      'Document clear clinical indication',
      'Include relevant test results',
      'Reference applicable coverage policies (NCD/LCD)',
    ],
    appealSuccessRate: 52,
  },
  'CO-96': {
    title: 'Non-Covered Charge',
    description: 'The service or procedure is not covered by the patient\'s insurance plan.',
    commonCauses: [
      'Service not in plan benefits',
      'Experimental or investigational procedure',
      'Cosmetic procedure',
    ],
    prevention: [
      'Verify coverage before service',
      'Check for plan exclusions',
      'Inform patient of potential liability',
    ],
    appealSuccessRate: 25,
  },
  'CO-97': {
    title: 'Payment Adjusted - Bundling',
    description: 'The payment was reduced because the service is bundled with another service per NCCI edits.',
    commonCauses: [
      'Component service billed separately',
      'Incorrect modifier usage',
      'Services performed at same session',
    ],
    prevention: [
      'Check NCCI edits before billing',
      'Use appropriate unbundling modifiers when justified',
      'Document distinct services clearly',
    ],
    appealSuccessRate: 40,
  },
}

export function DenialRiskBadge({ code, description, className }: DenialRiskBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false)

  // Get detailed info for this code
  const codeInfo = DENIAL_CODE_INFO[code]

  // Determine severity based on code prefix
  const getSeverity = (code: string): 'high' | 'medium' | 'low' => {
    // Common high-impact codes
    const highSeverity = ['CO-11', 'CO-15', 'CO-29', 'CO-50']
    const mediumSeverity = ['CO-16', 'CO-18', 'CO-96', 'CO-97']

    if (highSeverity.includes(code)) return 'high'
    if (mediumSeverity.includes(code)) return 'medium'
    return 'low'
  }

  const severity = getSeverity(code)

  const severityStyles = {
    high: 'bg-error-100 border-error-300 text-error-800',
    medium: 'bg-warning-100 border-warning-300 text-warning-800',
    low: 'bg-neutral-100 border-neutral-300 text-neutral-800',
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-sm font-medium',
          'transition-colors duration-150',
          'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-amber-500',
          severityStyles[severity],
          className
        )}
      >
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>Risk: {code}</span>
        {description && (
          <span className="hidden sm:inline">- {description}</span>
        )}
      </button>

      {/* Denial Code Reference Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent size="md">
          <ModalHeader>
            <ModalTitle>
              {code}: {codeInfo?.title || description || 'Denial Code Details'}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-1">Description</h4>
                <p className="text-sm text-neutral-600">
                  {codeInfo?.description || description || 'No detailed description available for this code.'}
                </p>
              </div>

              {/* Common Causes */}
              {codeInfo?.commonCauses && (
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-1">Common Causes</h4>
                  <ul className="text-sm text-neutral-600 list-disc list-inside space-y-1">
                    {codeInfo.commonCauses.map((cause, idx) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention */}
              {codeInfo?.prevention && (
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-1">Prevention</h4>
                  <ul className="text-sm text-neutral-600 list-disc list-inside space-y-1">
                    {codeInfo.prevention.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Appeal Success Rate */}
              {codeInfo?.appealSuccessRate !== undefined && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-neutral-50 border border-neutral-200">
                  <Info className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">
                    Appeal Success Rate: <strong>{codeInfo.appealSuccessRate}%</strong>
                  </span>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            {codeInfo && (
              <Button onClick={() => { /* TODO: Open appeal template */ }}>
                View Appeal Template
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
