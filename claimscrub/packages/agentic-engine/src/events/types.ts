import type { Patient, Diagnosis } from '@claimscrub/shared'
import type { Procedure, Authorization } from '../context/types'

export type ClaimFlowEvent =
  // Patient events
  | { type: 'LOAD_PATIENT'; patientId: string }
  | { type: 'PATIENT_LOADED'; patient: Patient }
  | { type: 'PATIENT_ERROR'; error: string }
  | { type: 'CONFIRM_PATIENT' }
  | { type: 'EDIT_PATIENT' }
  | { type: 'SAVE_PATIENT'; patient: Patient }

  // Procedure events
  | { type: 'SELECT_PROCEDURE'; procedure: Procedure }
  | { type: 'SEARCH_PROCEDURE'; query: string }
  | { type: 'SET_MODIFIERS'; modifiers: string[] }

  // Diagnosis events
  | { type: 'APPLY_DIAGNOSIS'; diagnoses: Diagnosis[] }
  | { type: 'ADD_DIAGNOSIS'; diagnosis: Diagnosis }
  | { type: 'REMOVE_DIAGNOSIS'; code: string }

  // Auth events
  | { type: 'CHECK_AUTH' }
  | { type: 'AUTH_FOUND'; auth: Authorization }
  | { type: 'AUTH_REQUIRED' }
  | { type: 'AUTH_NOT_REQUIRED' }
  | { type: 'USE_AUTH'; auth: Authorization }
  | { type: 'SKIP_AUTH' }
  | { type: 'REQUEST_AUTH' }
  | { type: 'AUTH_RECEIVED'; auth: Authorization }
  | { type: 'AUTH_ERROR'; error: string }

  // Review events
  | { type: 'SET_DATE_OF_SERVICE'; date: Date }
  | { type: 'SET_PLACE_OF_SERVICE'; pos: string }
  | { type: 'UPDATE_CHARGE'; charge: number }

  // Submit events
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS'; claimId: string }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RETRY' }

  // Navigation events
  | { type: 'BACK' }
  | { type: 'CANCEL' }
  | { type: 'RESET' }

  // Edit from review
  | { type: 'EDIT_PROCEDURE' }
  | { type: 'EDIT_DIAGNOSIS' }
