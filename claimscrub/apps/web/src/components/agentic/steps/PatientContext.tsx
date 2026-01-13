import { useFlow } from '../FlowProvider'
import { Card } from '@claimscrub/ui'
import { KeyboardHint } from '../KeyboardHint'
import { ConfirmButton } from '../ConfirmButton'
import { CheckCircle } from 'lucide-react'

/**
 * Step 1: Patient Context
 * Auto-pulled from Epic - zero data entry required
 * Matches: 08_agentic_patient_context.svg
 */
export function PatientContext() {
  const { context, confirmPatient, editPatient, isLoading } = useFlow()
  const { patient } = context

  if (isLoading || !patient) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-neutral-100 rounded-lg" />
        <div className="h-32 bg-neutral-100 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Auto-pulled banner */}
      <div className="flex items-center gap-3 rounded-lg bg-success-50 px-4 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100">
          <CheckCircle className="h-4 w-4 text-success-600" />
        </div>
        <span className="font-medium text-success-700">
          Patient data auto-pulled from Epic
        </span>
        <KeyboardHint className="ml-auto" />
      </div>

      {/* Patient Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-neutral-900">
            Patient Information
          </h3>
          <span className="rounded-md bg-success-100 px-2 py-1 text-xs font-medium text-success-700">
            Verified
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Patient Card */}
          <Card className="bg-neutral-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-body-sm text-neutral-500">Name</p>
                <p className="font-semibold text-neutral-900">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-500">Date of Birth</p>
                <p className="font-semibold text-neutral-900">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-500">Gender</p>
                <p className="text-neutral-900">{patient.gender}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-500">MRN</p>
                <p className="code text-neutral-900">{patient.mrn}</p>
              </div>
            </div>
          </Card>

          {/* Insurance Card */}
          <Card className="bg-neutral-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-body-sm text-neutral-500">Payer</p>
                <p className="font-semibold text-neutral-900">
                  {patient.insurance.payerName}
                </p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-500">Member ID</p>
                <p className="code text-neutral-900">{patient.insurance.memberId}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-500">Group</p>
                <p className="text-neutral-900">
                  {patient.insurance.groupNumber || '—'}
                </p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-500">Coverage Status</p>
                <span className="inline-flex rounded-md bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
                  Active
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Diagnoses */}
      <div className="space-y-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-neutral-900">
            Active Diagnoses from Chart
          </h3>
          <p className="text-body-sm text-neutral-500">
            These will be suggested when adding procedures
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {patient.activeDiagnoses.map((dx, i) => (
            <div
              key={dx.code}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                i === 0
                  ? 'border-warning-300 bg-warning-50'
                  : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <span className="code text-body-sm">{dx.code}</span>
              <span className="text-body-sm text-neutral-600">{dx.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={editPatient}
          className="rounded-lg border border-neutral-200 bg-white px-6 py-3 text-neutral-600 hover:bg-neutral-50"
        >
          Edit
        </button>

        <ConfirmButton onClick={confirmPatient}>
          Confirm
        </ConfirmButton>
      </div>

      {/* Bottom guide */}
      <div className="rounded-lg bg-neutral-100 px-4 py-3 text-center text-body-sm text-neutral-500">
        Press Tab to move focus, Enter to confirm. All data pulled from Epic - no typing required.
      </div>
    </div>
  )
}
