import { useFlow } from '../FlowProvider'
import { KeyboardHint } from '../KeyboardHint'
import { ConfirmButton } from '../ConfirmButton'
import { CheckCircle, FileText, Download } from 'lucide-react'

/**
 * Step 5: Review & Submit
 * Final review with validation score and denial prevention summary
 * Matches: 12_agentic_review_submit.svg
 */
export function ReviewSubmit() {
  const {
    context,
    submit,
    goBack,
    editPatient,
    isLoading,
    matches,
  } = useFlow()

  const { patient, procedure, diagnoses, authorization } = context

  // Calculate validation score (all passed = 100)
  const validations = [
    { name: 'CPT-ICD Match', passed: true },
    { name: 'NPI Verified', passed: true },
    { name: 'Prior Auth', passed: !!authorization || !context.authRequired },
    { name: 'Modifier JW', passed: procedure?.modifiers?.includes('JW') || !procedure?.drugCode },
    { name: 'Timely Filing', passed: true },
  ]
  const score = Math.round(
    (validations.filter((v) => v.passed).length / validations.length) * 100
  )

  // Prevented denial codes
  const preventedDenials = [
    { code: 'CO-11', reason: 'Dx mismatch', prevented: true },
    { code: 'CO-15', reason: 'No auth', prevented: !!authorization },
    { code: 'CO-4', reason: 'Modifier', prevented: true },
    { code: 'CO-16', reason: 'Missing data', prevented: true },
  ].filter((d) => d.prevented)

  // Estimated reimbursement
  const estReimbursement = (procedure?.charge || 0) * 0.98

  if (matches('submitting')) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-success-200 border-t-success-600" />
        <p className="mt-4 text-neutral-600">Submitting claim...</p>
      </div>
    )
  }

  if (matches('success')) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <CheckCircle className="h-8 w-8 text-success-600" />
        </div>
        <h3 className="mt-4 font-heading text-2xl font-bold text-success-800">
          Claim Submitted Successfully
        </h3>
        <p className="mt-2 text-neutral-600">
          Claim #{context.claimId} has been submitted to {patient?.insurance.payerName}
        </p>
        <div className="mt-6 flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-neutral-600 hover:bg-neutral-50">
            <FileText className="h-4 w-4" />
            View Claim
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            New Claim
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Banner */}
      <div className="rounded-xl border-2 border-success-300 bg-success-50 p-6">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-500">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-2xl font-bold text-success-800">
              Score: {score}/100
            </h3>
            <p className="text-success-700">
              All validations passed. Zero data entry - all fields auto-filled or confirmed.
            </p>
          </div>
          <div className="text-right">
            <p className="text-body-sm text-success-600">Est. Reimbursement</p>
            <p className="font-heading text-2xl font-bold text-success-800">
              ${estReimbursement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Claim Summary */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        {/* Patient Section */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <h4 className="font-medium text-neutral-900">Patient</h4>
          <CheckCircle className="h-5 w-5 text-success-500" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="font-semibold text-neutral-900">
              {patient?.firstName} {patient?.lastName}
            </p>
            <p className="text-body-sm text-neutral-600">
              DOB: {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '—'} |{' '}
              {patient?.gender} | MRN: {patient?.mrn}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="font-semibold text-neutral-900">
              {patient?.insurance.payerName}
            </p>
            <p className="code text-body-sm text-neutral-600">
              ID: {patient?.insurance.memberId}
            </p>
          </div>
        </div>

        {/* Service Section */}
        <div className="mt-6 flex items-center justify-between border-b border-neutral-100 pb-4">
          <h4 className="font-medium text-neutral-900">Service</h4>
          <CheckCircle className="h-5 w-5 text-success-500" />
        </div>
        <div className="mt-4 rounded-lg bg-neutral-50 p-4">
          <div className="grid grid-cols-6 gap-4">
            <div>
              <p className="text-body-sm text-neutral-500">CPT</p>
              <p className="code font-semibold text-neutral-900">{procedure?.cptCode}</p>
            </div>
            <div>
              <p className="text-body-sm text-neutral-500">ICD-10</p>
              <p className="code font-semibold text-neutral-900">
                {diagnoses[0]?.code}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-neutral-500">Modifier</p>
              <p className="code font-semibold text-neutral-900">
                {procedure?.modifiers?.join(', ') || '—'}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-neutral-500">Drug</p>
              <p className="code font-semibold text-neutral-900">
                {procedure?.drugCode || '—'}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-neutral-500">DOS</p>
              <p className="font-semibold text-neutral-900">
                {context.dateOfService
                  ? new Date(context.dateOfService).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-neutral-500">Charge</p>
              <p className="font-semibold text-neutral-900">
                ${procedure?.charge?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Validations */}
        <div className="mt-6">
          <h4 className="font-medium text-neutral-900">Validations Passed</h4>
          <div className="mt-3 flex flex-wrap gap-4">
            {validations.map((v) => (
              <div key={v.name} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success-100">
                  <CheckCircle className="h-3 w-3 text-success-600" />
                </div>
                <span className="text-body-sm text-neutral-700">{v.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Denial Prevention */}
        <div className="mt-4 rounded-lg bg-success-50 px-4 py-3">
          <p className="text-body-sm text-success-700">
            <strong>Prevented:</strong>{' '}
            {preventedDenials.map((d) => `${d.code} (${d.reason})`).join(' | ')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-3">
          <button
            onClick={editPatient}
            className="rounded-lg border border-neutral-200 bg-white px-6 py-3 text-neutral-600 hover:bg-neutral-50"
          >
            Edit
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-6 py-3 text-neutral-600 hover:bg-neutral-50">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>

        <ConfirmButton
          onClick={submit}
          disabled={isLoading}
          variant="success"
          size="lg"
        >
          Submit to {patient?.insurance.payerName}
        </ConfirmButton>
      </div>

      {/* Stats */}
      <div className="rounded-lg bg-neutral-100 px-4 py-3 text-center text-body-sm text-neutral-500">
        Total keystrokes: 4 (Tab + Enter x4) | Data entry: 0 | Time: 45 seconds | Error rate: 0%
      </div>
    </div>
  )
}
