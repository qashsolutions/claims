import { useMachine } from '@xstate/react'
import { claimFlowMachine } from '../machines/claim-flow.machine'
import type { ClaimFlowContext, Procedure, Authorization } from '../context/types'
import type { Patient, Diagnosis } from '@claimscrub/shared'

interface FlowActors {
  fetchPatient: (patientId: string) => Promise<Patient>
  checkAuthorization: (
    procedure: Procedure | null,
    patient: Patient | null
  ) => Promise<{ required: boolean; authorization: Authorization | null }>
  submitClaim: (context: ClaimFlowContext) => Promise<{ claimId: string }>
}

export function useFlowMachine(actors: FlowActors) {
  const [state, send, actorRef] = useMachine(
    claimFlowMachine.provide({
      actors: {
        fetchPatient: async ({ input }) => {
          return actors.fetchPatient(input.patientId)
        },
        checkAuthorization: async ({ input }) => {
          return actors.checkAuthorization(input.procedure, input.patient)
        },
        submitClaim: async ({ input }) => {
          return actors.submitClaim(input)
        },
      },
    })
  )

  return {
    state,
    send,
    actorRef,
    context: state.context,
    matches: state.matches,
    can: state.can,
  }
}
