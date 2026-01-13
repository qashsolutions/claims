import { useCallback } from 'react'
import { useFlowMachine, useFlowState, useFlowActions } from '@claimscrub/agentic-engine'
import { trpc } from '@/lib/trpc'

/**
 * Main hook for agentic claim flow
 * Connects XState machine to tRPC backend
 */
export function useAgenticFlow() {
  // tRPC mutations
  const fetchPatientMutation = trpc.epic.getPatient.useMutation()
  const checkAuthMutation = trpc.validation.checkAuth.useMutation()
  const submitClaimMutation = trpc.claims.create.useMutation()

  // XState machine with actors
  const { state, send, actorRef, context, matches, can } = useFlowMachine({
    fetchPatient: async (patientId: string) => {
      const result = await fetchPatientMutation.mutateAsync({ patientId })
      return result
    },
    checkAuthorization: async (procedure, patient) => {
      if (!procedure || !patient) {
        return { required: false, authorization: null }
      }
      const result = await checkAuthMutation.mutateAsync({
        cptCode: procedure.cptCode,
        drugCode: procedure.drugCode,
        patientId: patient.id,
        payerId: patient.insurance.payerId,
      })
      return result
    },
    submitClaim: async (context) => {
      const result = await submitClaimMutation.mutateAsync({
        patientId: context.patient!.id,
        dateOfService: context.dateOfService!,
        placeOfService: context.placeOfService!,
        serviceLines: [
          {
            lineNumber: 1,
            cptCode: context.procedure!.cptCode,
            modifiers: context.modifiers,
            icdCodes: context.diagnoses.map((d) => d.code),
            drugCode: context.procedure?.drugCode,
            drugUnits: context.procedure?.drugUnits,
            units: context.procedure!.units,
            charge: context.procedure!.charge,
          },
        ],
        priorAuthNumber: context.authorization?.number,
      })
      return { claimId: result.id }
    },
  })

  // Derived state
  const flowState = useFlowState(actorRef)
  const actions = useFlowActions(send)

  // Helper for current step
  const getCurrentStep = useCallback(() => {
    if (matches('patientContext')) return 1
    if (matches('procedureSelect')) return 2
    if (matches('diagnosisMatch')) return 3
    if (matches('authCheck')) return 4
    if (matches('reviewSubmit') || matches('submitting')) return 5
    return 0
  }, [matches])

  return {
    // State
    ...flowState,
    state,
    context,
    currentStep: getCurrentStep(),

    // Actions
    ...actions,

    // State checks
    matches,
    can,

    // Loading states
    isLoading:
      flowState.patientLoading ||
      flowState.authLoading ||
      matches('submitting'),
  }
}
