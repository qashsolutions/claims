import type { Patient, Diagnosis } from '@claimscrub/shared'
import type { Procedure, Authorization } from '../context/types'
import type { ClaimFlowEvent } from './types'

export const flowEvents = {
  // Patient
  loadPatient: (patientId: string): ClaimFlowEvent => ({
    type: 'LOAD_PATIENT',
    patientId,
  }),
  patientLoaded: (patient: Patient): ClaimFlowEvent => ({
    type: 'PATIENT_LOADED',
    patient,
  }),
  patientError: (error: string): ClaimFlowEvent => ({
    type: 'PATIENT_ERROR',
    error,
  }),
  confirmPatient: (): ClaimFlowEvent => ({ type: 'CONFIRM_PATIENT' }),
  editPatient: (): ClaimFlowEvent => ({ type: 'EDIT_PATIENT' }),
  savePatient: (patient: Patient): ClaimFlowEvent => ({
    type: 'SAVE_PATIENT',
    patient,
  }),

  // Procedure
  selectProcedure: (procedure: Procedure): ClaimFlowEvent => ({
    type: 'SELECT_PROCEDURE',
    procedure,
  }),
  searchProcedure: (query: string): ClaimFlowEvent => ({
    type: 'SEARCH_PROCEDURE',
    query,
  }),
  setModifiers: (modifiers: string[]): ClaimFlowEvent => ({
    type: 'SET_MODIFIERS',
    modifiers,
  }),

  // Diagnosis
  applyDiagnosis: (diagnoses: Diagnosis[]): ClaimFlowEvent => ({
    type: 'APPLY_DIAGNOSIS',
    diagnoses,
  }),
  addDiagnosis: (diagnosis: Diagnosis): ClaimFlowEvent => ({
    type: 'ADD_DIAGNOSIS',
    diagnosis,
  }),
  removeDiagnosis: (code: string): ClaimFlowEvent => ({
    type: 'REMOVE_DIAGNOSIS',
    code,
  }),

  // Auth
  checkAuth: (): ClaimFlowEvent => ({ type: 'CHECK_AUTH' }),
  authFound: (auth: Authorization): ClaimFlowEvent => ({
    type: 'AUTH_FOUND',
    auth,
  }),
  authRequired: (): ClaimFlowEvent => ({ type: 'AUTH_REQUIRED' }),
  authNotRequired: (): ClaimFlowEvent => ({ type: 'AUTH_NOT_REQUIRED' }),
  useAuth: (auth: Authorization): ClaimFlowEvent => ({
    type: 'USE_AUTH',
    auth,
  }),
  skipAuth: (): ClaimFlowEvent => ({ type: 'SKIP_AUTH' }),
  requestAuth: (): ClaimFlowEvent => ({ type: 'REQUEST_AUTH' }),
  authReceived: (auth: Authorization): ClaimFlowEvent => ({
    type: 'AUTH_RECEIVED',
    auth,
  }),
  authError: (error: string): ClaimFlowEvent => ({
    type: 'AUTH_ERROR',
    error,
  }),

  // Review
  setDateOfService: (date: Date): ClaimFlowEvent => ({
    type: 'SET_DATE_OF_SERVICE',
    date,
  }),
  setPlaceOfService: (pos: string): ClaimFlowEvent => ({
    type: 'SET_PLACE_OF_SERVICE',
    pos,
  }),
  updateCharge: (charge: number): ClaimFlowEvent => ({
    type: 'UPDATE_CHARGE',
    charge,
  }),

  // Submit
  submit: (): ClaimFlowEvent => ({ type: 'SUBMIT' }),
  submitSuccess: (claimId: string): ClaimFlowEvent => ({
    type: 'SUBMIT_SUCCESS',
    claimId,
  }),
  submitError: (error: string): ClaimFlowEvent => ({
    type: 'SUBMIT_ERROR',
    error,
  }),
  retry: (): ClaimFlowEvent => ({ type: 'RETRY' }),

  // Navigation
  back: (): ClaimFlowEvent => ({ type: 'BACK' }),
  cancel: (): ClaimFlowEvent => ({ type: 'CANCEL' }),
  reset: (): ClaimFlowEvent => ({ type: 'RESET' }),

  // Edit from review
  editProcedure: (): ClaimFlowEvent => ({ type: 'EDIT_PROCEDURE' }),
  editDiagnosis: (): ClaimFlowEvent => ({ type: 'EDIT_DIAGNOSIS' }),
}
