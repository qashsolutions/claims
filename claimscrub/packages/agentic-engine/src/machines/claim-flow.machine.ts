import { setup, assign, fromPromise } from 'xstate'
import type { ClaimFlowContext } from '../context/types'
import type { ClaimFlowEvent } from '../events/types'
import { initialContext } from '../context/types'

/**
 * ClaimFlow State Machine
 *
 * This XState machine orchestrates the agentic claim submission workflow.
 * It manages the complete flow from patient selection through claim submission.
 *
 * ARCHITECTURE NOTES:
 * - Actors defined here are DEFAULT implementations that MUST be overridden
 *   at runtime via the `.provide()` method in useFlowMachine hook
 * - The consuming application (web app) provides actual API implementations
 *   that connect to Epic FHIR, validation services, and claim submission APIs
 * - This separation allows the state machine to be framework-agnostic while
 *   maintaining type safety through strongly-typed actor interfaces
 *
 * USAGE:
 * ```typescript
 * const machine = claimFlowMachine.provide({
 *   actors: {
 *     fetchPatient: async ({ input }) => epicClient.getPatient(input.patientId),
 *     checkAuthorization: async ({ input }) => authService.check(input),
 *     submitClaim: async ({ input }) => claimsApi.submit(input),
 *   }
 * })
 * ```
 */
export const claimFlowMachine = setup({
  types: {
    context: {} as ClaimFlowContext,
    events: {} as ClaimFlowEvent,
  },
  actors: {
    /**
     * fetchPatient Actor
     *
     * Retrieves patient demographic and clinical data from the EHR system.
     *
     * INPUT:
     * - patientId: string - The unique patient identifier (Epic FHIR ID or MRN)
     *
     * OUTPUT:
     * - Patient object containing:
     *   - Demographics (name, DOB, gender, contact info)
     *   - Insurance information (payer, member ID, group number)
     *   - Active diagnoses for ICD code suggestions
     *
     * IMPLEMENTATION REQUIREMENTS:
     * - Must be provided via .provide() by the consuming application
     * - Should integrate with Epic FHIR Patient, Coverage, and Condition endpoints
     * - Must handle FHIR resource transformation to internal Patient type
     * - Should implement proper error handling for network/auth failures
     *
     * EXAMPLE IMPLEMENTATION:
     * ```typescript
     * fetchPatient: async ({ input }) => {
     *   const [patient, conditions, coverage] = await Promise.all([
     *     epicClient.getPatient(input.patientId, tokens),
     *     epicClient.getConditions(input.patientId, tokens),
     *     epicClient.getCoverage(input.patientId, tokens),
     *   ])
     *   return transformToPatient(patient, conditions, coverage)
     * }
     * ```
     */
    fetchPatient: fromPromise<
      ClaimFlowContext['patient'],
      { patientId: string }
    >(async ({ input }) => {
      // PRODUCTION NOTE: This default implementation throws to ensure the actor
      // is properly provided by the consuming application. The error message
      // includes context to aid debugging in case of misconfiguration.
      const errorMessage = [
        'fetchPatient actor not configured.',
        `Attempted to fetch patient with ID: ${input.patientId}`,
        'This actor must be provided via claimFlowMachine.provide() with an',
        'implementation that connects to your EHR system (e.g., Epic FHIR API).',
        'See useFlowMachine hook for implementation reference.',
      ].join('\n')
      throw new Error(errorMessage)
    }),

    /**
     * checkAuthorization Actor
     *
     * Determines prior authorization requirements and retrieves existing approvals.
     * This is critical for preventing CO-15 (Authorization Required) denials.
     *
     * INPUT:
     * - procedure: Selected CPT code, drug code, and modifiers
     * - patient: Patient data including insurance/payer information
     *
     * OUTPUT:
     * - required: boolean - Whether prior auth is needed for this procedure/payer
     * - authorization: Authorization object if existing approval found, null otherwise
     *   - number: Prior auth reference number
     *   - status: 'active' | 'expired' | 'pending'
     *   - validFrom/validTo: Date range of authorization validity
     *   - authorizedUnits/remainingUnits: Unit tracking for high-cost drugs
     *
     * IMPLEMENTATION REQUIREMENTS:
     * - Must query payer-specific authorization rules for the CPT/HCPCS codes
     * - Should check Epic ClaimResponse endpoint for existing prior auths
     * - Must validate that existing auth covers the specific service codes
     * - Should check authorization date validity against service date
     *
     * PAYER RULE SOURCES:
     * - CMS Medicare Coverage Database (MCD) for Medicare patients
     * - Payer-specific portals or Availity for commercial payers
     * - State Medicaid rules for Medicaid patients
     *
     * EXAMPLE IMPLEMENTATION:
     * ```typescript
     * checkAuthorization: async ({ input }) => {
     *   const { procedure, patient } = input
     *
     *   // Check if procedure requires auth for this payer
     *   const rules = await authRulesService.check(procedure.cptCode, patient.insurance.payerId)
     *
     *   if (!rules.authRequired) {
     *     return { required: false, authorization: null }
     *   }
     *
     *   // Look for existing authorization in Epic
     *   const existingAuths = await epicClient.getAuthorizations(
     *     patient.id, tokens, procedure.cptCode
     *   )
     *
     *   const validAuth = existingAuths.find(auth =>
     *     auth.status === 'approved' &&
     *     new Date(auth.validTo) > new Date()
     *   )
     *
     *   return { required: true, authorization: validAuth || null }
     * }
     * ```
     */
    checkAuthorization: fromPromise<
      { required: boolean; authorization: ClaimFlowContext['authorization'] },
      { procedure: ClaimFlowContext['procedure']; patient: ClaimFlowContext['patient'] }
    >(async ({ input }) => {
      // PRODUCTION NOTE: This default implementation throws to ensure the actor
      // is properly provided. Authorization checking is critical for claim success.
      const procedureInfo = input.procedure
        ? `CPT: ${input.procedure.cptCode}, Drug: ${input.procedure.drugCode || 'N/A'}`
        : 'No procedure selected'
      const patientInfo = input.patient
        ? `Patient: ${input.patient.id}, Payer: ${input.patient.insurance.payerId}`
        : 'No patient selected'

      const errorMessage = [
        'checkAuthorization actor not configured.',
        `Procedure: ${procedureInfo}`,
        `${patientInfo}`,
        'This actor must be provided via claimFlowMachine.provide() with an',
        'implementation that checks payer authorization rules and Epic for existing auths.',
        'Proper authorization checking prevents CO-15 denials.',
      ].join('\n')
      throw new Error(errorMessage)
    }),

    /**
     * submitClaim Actor
     *
     * Creates and submits the claim to the clearinghouse/payer.
     * This is the final step that persists the claim and initiates submission.
     *
     * INPUT:
     * - Full ClaimFlowContext containing:
     *   - patient: Patient demographics and insurance
     *   - procedure: Selected CPT/HCPCS codes with modifiers
     *   - diagnoses: ICD-10 codes with proper ordering (primary first)
     *   - authorization: Prior auth number if applicable
     *   - dateOfService: Service date
     *   - placeOfService: POS code (e.g., '11' for office, '22' for outpatient)
     *   - totalCharge: Calculated charge amount
     *
     * OUTPUT:
     * - claimId: string - The unique identifier for the created claim
     *
     * IMPLEMENTATION REQUIREMENTS:
     * - Must create claim record in database with DRAFT status
     * - Should trigger async validation pipeline (NCCI edits, LCD checks, etc.)
     * - Must associate claim with practice and creating user for audit
     * - Should generate EDI 837P format for clearinghouse submission
     * - Must create audit log entry for compliance
     *
     * VALIDATION CHECKS TO PERFORM:
     * - All required fields populated
     * - ICD codes support medical necessity for CPT codes
     * - Modifiers are valid for the procedure
     * - Prior auth number valid if auth was required
     * - Service date within auth validity period
     *
     * EXAMPLE IMPLEMENTATION:
     * ```typescript
     * submitClaim: async ({ input }) => {
     *   // Validate all required data is present
     *   if (!input.patient || !input.procedure || !input.diagnoses.length) {
     *     throw new Error('Missing required claim data')
     *   }
     *
     *   // Create claim via API
     *   const claim = await claimsApi.create({
     *     patientId: input.patient.id,
     *     dateOfService: input.dateOfService,
     *     placeOfService: input.placeOfService,
     *     priorAuthNumber: input.authorization?.number,
     *     serviceLines: [{
     *       cptCode: input.procedure.cptCode,
     *       modifiers: input.procedure.modifiers,
     *       icdCodes: input.diagnoses.map(d => d.code),
     *       charge: input.totalCharge,
     *     }]
     *   })
     *
     *   return { claimId: claim.id }
     * }
     * ```
     */
    submitClaim: fromPromise<
      { claimId: string },
      ClaimFlowContext
    >(async ({ input }) => {
      // PRODUCTION NOTE: This default implementation throws to ensure the actor
      // is properly provided. Claim submission requires proper API integration.
      const contextSummary = [
        `Patient: ${input.patient?.id || 'Not selected'}`,
        `Procedure: ${input.procedure?.cptCode || 'Not selected'}`,
        `Diagnoses: ${input.diagnoses.length} selected`,
        `Auth: ${input.authorization?.number || 'None'}`,
        `Charge: $${input.totalCharge}`,
      ].join(', ')

      const errorMessage = [
        'submitClaim actor not configured.',
        `Context: ${contextSummary}`,
        'This actor must be provided via claimFlowMachine.provide() with an',
        'implementation that creates the claim in your database and submits',
        'to the clearinghouse. See claims.ts tRPC procedures for reference.',
      ].join('\n')
      throw new Error(errorMessage)
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
