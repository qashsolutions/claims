import type { Patient, Diagnosis } from '@claimscrub/shared'

export interface Procedure {
  cptCode: string
  description: string
  modifiers: string[]
  charge: number
  units: number
  drugCode?: string
  drugUnits?: number
}

export interface Authorization {
  number: string
  status: 'active' | 'expired' | 'pending'
  validFrom: Date
  validTo: Date
  authorizedUnits: number
  remainingUnits: number
}

export interface FlowValidation {
  check: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  denialCode?: string
}

export interface ClaimFlowContext {
  // Patient data from Epic
  patient: Patient | null
  patientLoading: boolean
  patientError: string | null

  // Selected procedure
  procedure: Procedure | null
  suggestedProcedures: Procedure[]

  // Diagnoses
  diagnoses: Diagnosis[]
  suggestedDiagnoses: Diagnosis[]

  // Modifiers
  modifiers: string[]
  suggestedModifiers: string[]

  // Authorization
  authorization: Authorization | null
  authRequired: boolean
  authLoading: boolean
  authError: string | null

  // Validation
  validations: FlowValidation[]
  score: number | null

  // Service details
  dateOfService: Date | null
  placeOfService: string | null
  totalCharge: number

  // Result
  claimId: string | null
  error: string | null
}

export const initialContext: ClaimFlowContext = {
  patient: null,
  patientLoading: false,
  patientError: null,

  procedure: null,
  suggestedProcedures: [],

  diagnoses: [],
  suggestedDiagnoses: [],

  modifiers: [],
  suggestedModifiers: [],

  authorization: null,
  authRequired: false,
  authLoading: false,
  authError: null,

  validations: [],
  score: null,

  dateOfService: null,
  placeOfService: null,
  totalCharge: 0,

  claimId: null,
  error: null,
}
