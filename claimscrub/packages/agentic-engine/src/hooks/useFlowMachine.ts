import { useMachine } from '@xstate/react'
import { fromPromise } from 'xstate'
import { claimFlowMachine } from '../machines/claim-flow.machine'
import type { ClaimFlowContext, Procedure, Authorization } from '../context/types'
import type { Patient, Diagnosis } from '@claimscrub/shared'

interface FlowActors {
  fetchPatient: (patientId: string) => Promise<Patient | null>
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
        fetchPatient: fromPromise(async ({ input }: { input: { patientId: string } }) => {
          return actors.fetchPatient(input.patientId)
        }),
        checkAuthorization: fromPromise(async ({ input }: { input: { procedure: Procedure | null; patient: Patient | null } }) => {
          return actors.checkAuthorization(input.procedure, input.patient)
        }),
        submitClaim: fromPromise(async ({ input }: { input: ClaimFlowContext }) => {
          return actors.submitClaim(input)
        }),
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
