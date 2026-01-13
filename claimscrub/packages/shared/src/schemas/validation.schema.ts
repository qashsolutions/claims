import { z } from 'zod'

export const validationCheckSchema = z.enum([
  'CPT_ICD_MATCH',
  'NPI_VERIFY',
  'MODIFIER_CHECK',
  'PRIOR_AUTH',
  'DATA_COMPLETENESS',
  'TIMELY_FILING',
  'NCCI_EDITS',
])

export const validationStatusSchema = z.enum(['PASS', 'WARNING', 'FAIL'])

export const validationResultSchema = z.object({
  id: z.string(),
  checkType: validationCheckSchema,
  status: validationStatusSchema,
  denialCode: z.string().optional(),
  message: z.string(),
  suggestion: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const validateClaimSchema = z.object({
  claimId: z.string(),
  checks: z.array(validationCheckSchema).optional(),
})

export type ValidationCheckType = z.infer<typeof validationCheckSchema>
export type ValidationStatusType = z.infer<typeof validationStatusSchema>
export type ValidationResultType = z.infer<typeof validationResultSchema>
export type ValidateClaimInput = z.infer<typeof validateClaimSchema>
