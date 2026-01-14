import { FlowProvider, FlowContainer, useFlow, SuggestionCard, ConfirmButton } from '@/components/agentic'
import { Button, Card, Badge } from '@claimscrub/ui'
import type { Diagnosis } from '@claimscrub/shared'
import type { Procedure } from '@claimscrub/agentic-engine'

function PatientStep() {
  const { patient, confirmPatient, patientLoading } = useFlow()

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No patient loaded. Enter a patient ID to begin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-neutral-900">Confirm Patient</h2>
        <p className="text-body-sm text-neutral-500">Verify patient information from Epic</p>
      </div>

      <Card variant="success" className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-body-sm text-neutral-500">Patient</p>
            <p className="mt-1 font-heading text-xl font-bold text-neutral-900">
              {patient.lastName}, {patient.firstName}
            </p>
            <div className="mt-2 flex items-center gap-4 text-body-sm text-neutral-600">
              <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
              <span>MRN: {patient.mrn}</span>
              <span>Gender: {patient.gender}</span>
            </div>
          </div>
          <Badge variant="success">Verified</Badge>
        </div>

        <div className="mt-4 rounded-lg bg-neutral-50 p-4">
          <p className="text-body-sm text-neutral-500">Insurance</p>
          <p className="font-medium text-neutral-900">{patient.insurance.payerName}</p>
          <p className="font-mono text-body-sm text-neutral-600">{patient.insurance.memberId}</p>
        </div>

        {patient.activeDiagnoses.length > 0 && (
          <div className="mt-4">
            <p className="text-body-sm text-neutral-500">Active Diagnoses</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {patient.activeDiagnoses.map((dx: Diagnosis) => (
                <Badge key={dx.code} variant="default">
                  {dx.code} - {dx.description}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-end">
        <ConfirmButton variant="success" onClick={confirmPatient}>
          Confirm Patient
        </ConfirmButton>
      </div>
    </div>
  )
}

function ProcedureStep() {
  const { suggestedProcedures, selectProcedure, goBack } = useFlow()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-neutral-900">Select Procedure</h2>
        <p className="text-body-sm text-neutral-500">Choose from frequent procedures or search</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {suggestedProcedures.length > 0 ? (
          suggestedProcedures.map((proc: Procedure) => (
            <SuggestionCard
              key={proc.cptCode}
              title={proc.cptCode}
              description={proc.description}
              badge="Suggested"
              badgeVariant="warning"
              onClick={() => selectProcedure(proc)}
            />
          ))
        ) : (
          <>
            <SuggestionCard
              title="96413"
              description="Chemotherapy IV infusion, first hour"
              badge="Suggested"
              badgeVariant="warning"
              onClick={() =>
                selectProcedure({
                  cptCode: '96413',
                  description: 'Chemotherapy IV infusion, first hour',
                  modifiers: [],
                  charge: 650,
                  units: 1,
                })
              }
            />
            <SuggestionCard
              title="99215"
              description="Office visit, established, high complexity"
              onClick={() =>
                selectProcedure({
                  cptCode: '99215',
                  description: 'Office visit, established, high complexity',
                  modifiers: [],
                  charge: 185,
                  units: 1,
                })
              }
            />
          </>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goBack}>
          Back
        </Button>
      </div>
    </div>
  )
}

function FlowContent() {
  const { matches, currentStep } = useFlow()

  return (
    <FlowContainer>
      {matches('patientContext') && <PatientStep />}
      {matches('procedureSelect') && <ProcedureStep />}
      {/* Additional steps would be rendered here */}
      {currentStep > 2 && (
        <div className="py-12 text-center">
          <p className="text-neutral-500">Additional flow steps coming soon...</p>
        </div>
      )}
    </FlowContainer>
  )
}

export default function NewClaimPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">New Claim</h1>
        <p className="text-body-sm text-neutral-500">
          Follow the guided flow. Use <kbd className="kbd">Tab</kbd> + <kbd className="kbd">Enter</kbd> to navigate.
        </p>
      </div>

      <FlowProvider>
        <FlowContent />
      </FlowProvider>
    </div>
  )
}
