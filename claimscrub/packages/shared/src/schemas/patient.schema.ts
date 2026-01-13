import { z } from 'zod'

export const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().length(2),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid postal code'),
})

export const insuranceSchema = z.object({
  payerId: z.string().min(1),
  payerName: z.string().min(1),
  memberId: z.string().min(1),
  groupNumber: z.string().optional(),
  planType: z.enum(['MEDICARE', 'MEDICAID', 'COMMERCIAL', 'SELF_PAY']),
  isPrimary: z.boolean().default(true),
})

export const diagnosisSchema = z.object({
  code: z.string().regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code'),
  description: z.string().min(1),
  type: z.enum(['PRIMARY', 'SECONDARY']),
  onsetDate: z.coerce.date().optional(),
  status: z.enum(['ACTIVE', 'RESOLVED', 'CHRONIC']),
})

export const patientSchema = z.object({
  id: z.string(),
  mrn: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(['M', 'F', 'O']),
  address: addressSchema.optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  insurance: insuranceSchema,
  activeDiagnoses: z.array(diagnosisSchema),
})

export type AddressInput = z.infer<typeof addressSchema>
export type InsuranceInput = z.infer<typeof insuranceSchema>
export type DiagnosisInput = z.infer<typeof diagnosisSchema>
export type PatientInput = z.infer<typeof patientSchema>
