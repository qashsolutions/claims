export type ValidationCheck =
  | 'CPT_ICD_MATCH'
  | 'NPI_VERIFY'
  | 'MODIFIER_CHECK'
  | 'PRIOR_AUTH'
  | 'DATA_COMPLETENESS'
  | 'TIMELY_FILING'
  | 'NCCI_EDITS'

export type ValidationStatus = 'PASS' | 'WARNING' | 'FAIL'

export interface ValidationResult {
  id: string
  checkType: ValidationCheck
  status: ValidationStatus
  denialCode?: string
  message: string
  suggestion?: string
  metadata?: Record<string, unknown>
}

export interface ClaimValidation {
  claimId: string
  score: number
  results: ValidationResult[]
  validatedAt: Date
}

export interface DenialRisk {
  code: string
  name: string
  probability: number
  preventedBy: ValidationCheck[]
}
