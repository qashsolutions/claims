import { setup, assign, fromPromise } from 'xstate'
import type { ClaimFlowContext } from '../context/types'
import type { ClaimFlowEvent } from '../events/types'
import { initialContext } from '../context/types'

export const claimFlowMachine = setup({
  types: {
    context: {} as ClaimFlowContext,
    events: {} as ClaimFlowEvent,
  },
  actors: {
    fetchPatient: fromPromise<
      ClaimFlowContext['patient'],
      { patientId: string }
    >(async ({ input }) => {
      // Will be provided by the app
      throw new Error('fetchPatient actor not implemented')
    }),
    checkAuthorization: fromPromise<
      { required: boolean; authorization: ClaimFlowContext['authorization'] },
      { procedure: ClaimFlowContext['procedure']; patient: ClaimFlowContext['patient'] }
    >(async ({ input }) => {
      // Will be provided by the app
      throw new Error('checkAuthorization actor not implemented')
    }),
    submitClaim: fromPromise<
      { claimId: string },
      ClaimFlowContext
    >(async ({ input }) => {
      // Will be provided by the app
      throw new Error('submitClaim actor not implemented')
    }),
  },
  guards: {
    isValidPatient: ({ context }) => context.patient !== null && context.patient.id !== '',
    isValidProcedure: ({ context }) => context.procedure !== null && context.procedure.cptCode !== '',
    isValidDiagnosis: ({ context }) => context.diagnoses.length > 0,
    isAuthRequired: ({ context }) => context.authRequired === true,
    hasValidAuth: ({ context }) =>
      context.authorization !== null && context.authorization.status === 'active',
    canSkipAuth: ({ context }) => !context.authRequired,
  },
  actions: {
    setPatientLoading: assign({ patientLoading: true, patientError: null }),
    setPatientLoaded: assign(({ event }) => {
      if (event.type !== 'PATIENT_LOADED') return {}
      return {
        patient: event.patient,
        patientLoading: false,
        suggestedDiagnoses: event.patient.activeDiagnoses,
      }
    }),
    setPatientError: assign(({ event }) => {
      if (event.type !== 'PATIENT_ERROR') return {}
      return { patientError: event.error, patientLoading: false }
    }),
    setProcedure: assign(({ event }) => {
      if (event.type !== 'SELECT_PROCEDURE') return {}
      return {
        procedure: event.procedure,
        totalCharge: event.procedure.charge * event.procedure.units,
      }
    }),
    setDiagnoses: assign(({ event }) => {
      if (event.type !== 'APPLY_DIAGNOSIS') return {}
      return { diagnoses: event.diagnoses }
    }),
    addDiagnosis: assign(({ context, event }) => {
      if (event.type !== 'ADD_DIAGNOSIS') return {}
      return { diagnoses: [...context.diagnoses, event.diagnosis] }
    }),
    removeDiagnosis: assign(({ context, event }) => {
      if (event.type !== 'REMOVE_DIAGNOSIS') return {}
      return { diagnoses: context.diagnoses.filter((d) => d.code !== event.code) }
    }),
    setAuthLoading: assign({ authLoading: true, authError: null }),
    setAuthResult: assign(({ event }) => {
      if (event.type === 'AUTH_FOUND') {
        return {
          authorization: event.auth,
          authRequired: true,
          authLoading: false,
        }
      }
      if (event.type === 'AUTH_REQUIRED') {
        return { authRequired: true, authLoading: false }
      }
      if (event.type === 'AUTH_NOT_REQUIRED') {
        return { authRequired: false, authLoading: false }
      }
      return {}
    }),
    setAuthorization: assign(({ event }) => {
      if (event.type !== 'USE_AUTH' && event.type !== 'AUTH_RECEIVED') return {}
      return { authorization: event.auth }
    }),
    setClaimId: assign(({ event }) => {
      if (event.type !== 'SUBMIT_SUCCESS') return {}
      return { claimId: event.claimId }
    }),
    setError: assign(({ event }) => {
      if (event.type !== 'SUBMIT_ERROR') return {}
      return { error: event.error }
    }),
    resetContext: assign(() => initialContext),
  },
}).createMachine({
  id: 'claimFlow',
  initial: 'patientContext',
  context: initialContext,
  states: {
    patientContext: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            LOAD_PATIENT: {
              target: 'loading',
              actions: 'setPatientLoading',
            },
          },
        },
        loading: {
          invoke: {
            src: 'fetchPatient',
            input: ({ event }) => {
              if (event.type === 'LOAD_PATIENT') {
                return { patientId: event.patientId }
              }
              return { patientId: '' }
            },
            onDone: {
              target: 'loaded',
              actions: assign(({ event }) => ({
                patient: event.output,
                patientLoading: false,
                suggestedDiagnoses: event.output?.activeDiagnoses || [],
              })),
            },
            onError: {
              target: 'error',
              actions: assign(({ event }) => ({
                patientError: String(event.error),
                patientLoading: false,
              })),
            },
          },
        },
        loaded: {
          on: {
            CONFIRM_PATIENT: {
              target: '#claimFlow.procedureSelect',
              guard: 'isValidPatient',
            },
            EDIT_PATIENT: '#claimFlow.patientEdit',
          },
        },
        error: {
          on: {
            LOAD_PATIENT: {
              target: 'loading',
              actions: 'setPatientLoading',
            },
          },
        },
      },
    },
    patientEdit: {
      on: {
        SAVE_PATIENT: {
          target: 'patientContext.loaded',
          actions: assign(({ event }) => ({
            patient: event.patient,
            suggestedDiagnoses: event.patient.activeDiagnoses,
          })),
        },
        CANCEL: 'patientContext.loaded',
      },
    },
    procedureSelect: {
      on: {
        SELECT_PROCEDURE: {
          target: 'diagnosisMatch',
          actions: 'setProcedure',
        },
        BACK: 'patientContext.loaded',
      },
    },
    diagnosisMatch: {
      on: {
        APPLY_DIAGNOSIS: {
          target: 'authCheck',
          guard: 'isValidDiagnosis',
          actions: 'setDiagnoses',
        },
        ADD_DIAGNOSIS: {
          actions: 'addDiagnosis',
        },
        REMOVE_DIAGNOSIS: {
          actions: 'removeDiagnosis',
        },
        BACK: 'procedureSelect',
      },
    },
    authCheck: {
      initial: 'checking',
      states: {
        checking: {
          invoke: {
            src: 'checkAuthorization',
            input: ({ context }) => ({
              procedure: context.procedure,
              patient: context.patient,
            }),
            onDone: [
              {
                target: 'found',
                guard: ({ event }) => event.output.authorization !== null,
                actions: assign(({ event }) => ({
                  authorization: event.output.authorization,
                  authRequired: event.output.required,
                  authLoading: false,
                })),
              },
              {
                target: 'required',
                guard: ({ event }) => event.output.required && event.output.authorization === null,
                actions: assign({
                  authRequired: true,
                  authLoading: false,
                }),
              },
              {
                target: 'notRequired',
                actions: assign({
                  authRequired: false,
                  authLoading: false,
                }),
              },
            ],
            onError: {
              target: 'error',
              actions: assign(({ event }) => ({
                authError: String(event.error),
                authLoading: false,
              })),
            },
          },
        },
        found: {
          on: {
            USE_AUTH: {
              target: '#claimFlow.reviewSubmit',
              actions: 'setAuthorization',
            },
            BACK: '#claimFlow.diagnosisMatch',
          },
        },
        required: {
          on: {
            REQUEST_AUTH: 'requesting',
            BACK: '#claimFlow.diagnosisMatch',
          },
        },
        requesting: {
          on: {
            AUTH_RECEIVED: {
              target: '#claimFlow.reviewSubmit',
              actions: 'setAuthorization',
            },
            CANCEL: 'required',
          },
        },
        notRequired: {
          on: {
            SKIP_AUTH: '#claimFlow.reviewSubmit',
            BACK: '#claimFlow.diagnosisMatch',
          },
        },
        error: {
          on: {
            CHECK_AUTH: 'checking',
            BACK: '#claimFlow.diagnosisMatch',
          },
        },
      },
    },
    reviewSubmit: {
      on: {
        SUBMIT: 'submitting',
        EDIT_PATIENT: 'patientEdit',
        EDIT_PROCEDURE: 'procedureSelect',
        EDIT_DIAGNOSIS: 'diagnosisMatch',
        BACK: 'authCheck',
        SET_DATE_OF_SERVICE: {
          actions: assign(({ event }) => ({ dateOfService: event.date })),
        },
        SET_PLACE_OF_SERVICE: {
          actions: assign(({ event }) => ({ placeOfService: event.pos })),
        },
        UPDATE_CHARGE: {
          actions: assign(({ event }) => ({ totalCharge: event.charge })),
        },
      },
    },
    submitting: {
      invoke: {
        src: 'submitClaim',
        input: ({ context }) => context,
        onDone: {
          target: 'success',
          actions: assign(({ event }) => ({ claimId: event.output.claimId })),
        },
        onError: {
          target: 'error',
          actions: assign(({ event }) => ({ error: String(event.error) })),
        },
      },
    },
    success: {
      type: 'final',
    },
    error: {
      on: {
        RETRY: 'submitting',
        BACK: 'reviewSubmit',
        RESET: {
          target: 'patientContext',
          actions: 'resetContext',
        },
      },
    },
  },
})
