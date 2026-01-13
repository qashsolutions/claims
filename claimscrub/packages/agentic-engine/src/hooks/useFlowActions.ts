import { useCallback } from 'react'
import type { Patient, Diagnosis } from '@claimscrub/shared'
import type { Procedure, Authorization } from '../context/types'
import type { ClaimFlowEvent } from '../events/types'

type SendFn = (event: ClaimFlowEvent) => void

export function useFlowActions(send: SendFn) {
  // Patient actions
  const loadPatient = useCallback(
    (patientId: string) => {
      send({ type: 'LOAD_PATIENT', patientId })
    },
    [send]
  )

  const confirmPatient = useCallback(() => {
    send({ type: 'CONFIRM_PATIENT' })
  }, [send])

  const editPatient = useCallback(() => {
    send({ type: 'EDIT_PATIENT' })
  }, [send])

  const savePatient = useCallback(
    (patient: Patient) => {
      send({ type: 'SAVE_PATIENT', patient })
    },
    [send]
  )

  // Procedure actions
  const selectProcedure = useCallback(
    (procedure: Procedure) => {
      send({ type: 'SELECT_PROCEDURE', procedure })
    },
    [send]
  )

  const searchProcedure = useCallback(
    (query: string) => {
      send({ type: 'SEARCH_PROCEDURE', query })
    },
    [send]
  )

  const setModifiers = useCallback(
    (modifiers: string[]) => {
      send({ type: 'SET_MODIFIERS', modifiers })
    },
    [send]
  )

  // Diagnosis actions
  const applyDiagnosis = useCallback(
    (diagnoses: Diagnosis[]) => {
      send({ type: 'APPLY_DIAGNOSIS', diagnoses })
    },
    [send]
  )

  const addDiagnosis = useCallback(
    (diagnosis: Diagnosis) => {
      send({ type: 'ADD_DIAGNOSIS', diagnosis })
    },
    [send]
  )

  const removeDiagnosis = useCallback(
    (code: string) => {
      send({ type: 'REMOVE_DIAGNOSIS', code })
    },
    [send]
  )

  // Auth actions
  const useAuth = useCallback(
    (auth: Authorization) => {
      send({ type: 'USE_AUTH', auth })
    },
    [send]
  )

  const skipAuth = useCallback(() => {
    send({ type: 'SKIP_AUTH' })
  }, [send])

  const requestAuth = useCallback(() => {
    send({ type: 'REQUEST_AUTH' })
  }, [send])

  // Review actions
  const setDateOfService = useCallback(
    (date: Date) => {
      send({ type: 'SET_DATE_OF_SERVICE', date })
    },
    [send]
  )

  const setPlaceOfService = useCallback(
    (pos: string) => {
      send({ type: 'SET_PLACE_OF_SERVICE', pos })
    },
    [send]
  )

  const updateCharge = useCallback(
    (charge: number) => {
      send({ type: 'UPDATE_CHARGE', charge })
    },
    [send]
  )

  // Submit actions
  const submit = useCallback(() => {
    send({ type: 'SUBMIT' })
  }, [send])

  const retry = useCallback(() => {
    send({ type: 'RETRY' })
  }, [send])

  // Navigation
  const goBack = useCallback(() => {
    send({ type: 'BACK' })
  }, [send])

  const cancel = useCallback(() => {
    send({ type: 'CANCEL' })
  }, [send])

  const reset = useCallback(() => {
    send({ type: 'RESET' })
  }, [send])

  return {
    // Patient
    loadPatient,
    confirmPatient,
    editPatient,
    savePatient,

    // Procedure
    selectProcedure,
    searchProcedure,
    setModifiers,

    // Diagnosis
    applyDiagnosis,
    addDiagnosis,
    removeDiagnosis,

    // Auth
    useAuth,
    skipAuth,
    requestAuth,

    // Review
    setDateOfService,
    setPlaceOfService,
    updateCharge,

    // Submit
    submit,
    retry,

    // Navigation
    goBack,
    cancel,
    reset,
  }
}
