import { useCallback } from 'react'
import { useFlowMachine, useFlowState, useFlowActions } from '@claimscrub/agentic-engine'
import { trpc } from '@/lib/trpc'
import type { Patient, Diagnosis } from '@claimscrub/shared'
import type { Authorization } from '@claimscrub/agentic-engine'

/**
 * Main hook for agentic claim flow
 * Connects XState machine to tRPC backend
 */
export function useAgenticFlow() {
  // tRPC queries and mutations
  const fetchPatientMutation = trpc.epic.getPatient.useMutation()
  const fetchConditionsQuery = trpc.epic.getConditions.useMutation()
  const fetchCoverageQuery = trpc.epic.getCoverage.useMutation()
  const checkAuthMutation = trpc.validation.checkAuth.useMutation()
  const submitClaimMutation = trpc.claims.create.useMutation()

  // XState machine with actors
  const { state, send, actorRef, context, matches, can } = useFlowMachine({
    fetchPatient: async (patientId: string): Promise<Patient | null> => {
      try {
        // Fetch patient, conditions, and coverage in parallel
        const [patient, conditions, coverage] = await Promise.all([
          fetchPatientMutation.mutateAsync({ patientId }),
          fetchConditionsQuery.mutateAsync({ patientId }),
          fetchCoverageQuery.mutateAsync({ patientId }),
        ])

        // Transform to full Patient type
        type CoverageResult = { status: string; payerId: string; payerName: string; memberId: string; groupNumber?: string; planType: string }
        type ConditionResult = { code: string; display: string; status: string; onsetDate?: string }

        const primaryCoverage = coverage.find((c: CoverageResult) => c.status === 'active')
        const activeDiagnoses: Diagnosis[] = conditions
          .filter((c: ConditionResult) => c.status === 'active')
          .map((c: ConditionResult) => ({
            code: c.code,
            description: c.display,
            type: 'PRIMARY' as const,
            onsetDate: c.onsetDate ? new Date(c.onsetDate) : undefined,
            status: 'ACTIVE' as const,
          }))

        return {
          id: patient.id,
          mrn: patient.mrn,
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: new Date(patient.dateOfBirth),
          gender: (patient.gender as 'M' | 'F' | 'O') || 'O',
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          insurance: primaryCoverage ? {
            payerId: primaryCoverage.payerId,
            payerName: primaryCoverage.payerName,
            memberId: primaryCoverage.memberId,
            groupNumber: primaryCoverage.groupNumber,
            planType: (primaryCoverage.planType as 'MEDICARE' | 'MEDICAID' | 'COMMERCIAL' | 'SELF_PAY') || 'COMMERCIAL',
            isPrimary: true,
          } : {
            payerId: '',
            payerName: 'Unknown',
            memberId: '',
            planType: 'COMMERCIAL' as const,
            isPrimary: true,
          },
          activeDiagnoses,
        }
      } catch (error) {
        console.error('Failed to fetch patient:', error)
        return null
      }
    },
    checkAuthorization: async (procedure, patient): Promise<{ required: boolean; authorization: Authorization | null }> => {
      if (!procedure || !patient) {
        return { required: false, authorization: null }
      }
      const result = await checkAuthMutation.mutateAsync({
        cptCode: procedure.cptCode,
        drugCode: procedure.drugCode,
        payerId: patient.insurance.payerId,
      })
      // Transform to Authorization type
      return {
        required: result.required,
        authorization: result.authorization ? {
          number: result.authorization.number,
          status: result.authorization.status as 'active' | 'expired' | 'pending',
          validFrom: new Date(result.authorization.validFrom),
          validTo: new Date(result.authorization.validTo),
          authorizedUnits: result.authorization.authorizedUnits ?? 0,
          remainingUnits: result.authorization.remainingUnits ?? 0,
        } : null,
      }
    },
    submitClaim: async (flowContext) => {
      const patient = flowContext.patient!
      const result = await submitClaimMutation.mutateAsync({
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientDob: patient.dateOfBirth,
        patientGender: patient.gender,
        insuranceId: patient.insurance.memberId,
        payerName: patient.insurance.payerName,
        payerId: patient.insurance.payerId,
        providerNpi: '1234567890', // TODO: Get from user context
        providerName: 'Provider', // TODO: Get from user context
        dateOfService: flowContext.dateOfService!,
        placeOfService: flowContext.placeOfService!,
        serviceLines: [
          {
            lineNumber: 1,
            cptCode: flowContext.procedure!.cptCode,
            modifiers: flowContext.modifiers,
            icdCodes: flowContext.diagnoses.map((d) => d.code),
            drugCode: flowContext.procedure?.drugCode,
            drugUnits: flowContext.procedure?.drugUnits,
            units: flowContext.procedure!.units,
            charge: flowContext.procedure!.charge,
          },
        ],
        priorAuthNumber: flowContext.authorization?.number,
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
