import { useSelector } from '@xstate/react'
import type { ActorRefFrom } from 'xstate'
import type { claimFlowMachine } from '../machines/claim-flow.machine'

type FlowActorRef = ActorRefFrom<typeof claimFlowMachine>

export function useFlowState(actorRef: FlowActorRef) {
  const patient = useSelector(actorRef, (state) => state.context.patient)
  const procedure = useSelector(actorRef, (state) => state.context.procedure)
  const diagnoses = useSelector(actorRef, (state) => state.context.diagnoses)
  const authorization = useSelector(actorRef, (state) => state.context.authorization)
  const authRequired = useSelector(actorRef, (state) => state.context.authRequired)
  const validations = useSelector(actorRef, (state) => state.context.validations)
  const score = useSelector(actorRef, (state) => state.context.score)
  const totalCharge = useSelector(actorRef, (state) => state.context.totalCharge)
  const claimId = useSelector(actorRef, (state) => state.context.claimId)
  const error = useSelector(actorRef, (state) => state.context.error)

  // Suggestions
  const suggestedProcedures = useSelector(actorRef, (state) => state.context.suggestedProcedures)
  const suggestedDiagnoses = useSelector(actorRef, (state) => state.context.suggestedDiagnoses)
  const suggestedModifiers = useSelector(actorRef, (state) => state.context.suggestedModifiers)

  // Loading states
  const patientLoading = useSelector(actorRef, (state) => state.context.patientLoading)
  const authLoading = useSelector(actorRef, (state) => state.context.authLoading)

  // Errors
  const patientError = useSelector(actorRef, (state) => state.context.patientError)
  const authError = useSelector(actorRef, (state) => state.context.authError)

  // Current step
  const currentStep = useSelector(actorRef, (state) => {
    if (state.matches('patientContext')) return 'patient'
    if (state.matches('patientEdit')) return 'patient-edit'
    if (state.matches('procedureSelect')) return 'procedure'
    if (state.matches('diagnosisMatch')) return 'diagnosis'
    if (state.matches('authCheck')) return 'auth'
    if (state.matches('reviewSubmit')) return 'review'
    if (state.matches('submitting')) return 'submitting'
    if (state.matches('success')) return 'success'
    if (state.matches('error')) return 'error'
    return 'unknown'
  })

  const stepNumber = useSelector(actorRef, (state) => {
    if (state.matches('patientContext') || state.matches('patientEdit')) return 1
    if (state.matches('procedureSelect')) return 2
    if (state.matches('diagnosisMatch')) return 3
    if (state.matches('authCheck')) return 4
    if (state.matches('reviewSubmit') || state.matches('submitting')) return 5
    if (state.matches('success')) return 6
    return 0
  })

  return {
    // Context
    patient,
    procedure,
    diagnoses,
    authorization,
    authRequired,
    validations,
    score,
    totalCharge,
    claimId,
    error,

    // Suggestions
    suggestedProcedures,
    suggestedDiagnoses,
    suggestedModifiers,

    // Loading
    patientLoading,
    authLoading,

    // Errors
    patientError,
    authError,

    // Navigation
    currentStep,
    stepNumber,
    totalSteps: 5,
  }
}
