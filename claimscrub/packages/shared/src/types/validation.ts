export type ValidationCheck =
  | 'CPT_ICD_MATCH'
  | 'NPI_VERIFY'
  | 'MODIFIER_CHECK'
  | 'PRIOR_AUTH'
  | 'DATA_COMPLETENESS'
  | 'TIMELY_FILING'
  | 'NCCI_EDITS'

export type ValidationStatus = 'PASS' | 'WARN' | 'FAIL'

export interface SuggestedCode {
  code: string
  type: 'icd' | 'cpt' | 'modifier'
  description?: string
}

export interface ActionButton {
  label: string
  action: string
  variant?: 'primary' | 'secondary' | 'outline'
}

export interface ValidationResult {
  id?: string
  type: ValidationCheck
  status: ValidationStatus
  message: string
  denialCode?: string
  denialDescription?: string
  recommendation?: string
  suggestedCodes?: SuggestedCode[]
  actionButtons?: ActionButton[]
  metadata?: Record<string, unknown>
}

// Alias for backwards compatibility
export type Validation = ValidationResult

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
