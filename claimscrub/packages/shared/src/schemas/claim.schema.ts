import { z } from 'zod'

export const serviceLineSchema = z.object({
  lineNumber: z.number().min(1),
  cptCode: z.string().regex(/^\d{5}$/, 'CPT code must be 5 digits'),
  cptDescription: z.string().optional(),
  modifiers: z.array(z.string().max(2)).max(4),
  icdCodes: z.array(z.string()).min(1, 'At least one diagnosis code required'),
  drugCode: z.string().optional(),
  drugUnits: z.number().optional(),
  units: z.number().min(1).default(1),
  charge: z.number().positive('Charge must be positive'),
})

export const createClaimSchema = z.object({
  patientName: z.string().min(1, 'Patient name required'),
  patientDob: z.coerce.date(),
  patientGender: z.enum(['M', 'F', 'O']),
  insuranceId: z.string().min(1, 'Insurance ID required'),
  payerName: z.string().min(1, 'Payer name required'),
  payerId: z.string().optional(),
  providerNpi: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits'),
  providerName: z.string().min(1, 'Provider name required'),
  dateOfService: z.coerce.date(),
  placeOfService: z.string().regex(/^\d{2}$/, 'Place of service must be 2 digits'),
  priorAuthNumber: z.string().optional(),
  serviceLines: z.array(serviceLineSchema).min(1, 'At least one service line required'),
})

export const claimFiltersSchema = z.object({
  status: z
    .enum([
      'DRAFT',
      'VALIDATING',
      'VALIDATED',
      'SUBMITTED',
      'ACCEPTED',
      'PAID',
      'DENIED',
      'APPEALING',
    ])
    .optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  patientName: z.string().optional(),
  providerNpi: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'dateOfService', 'status', 'score']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type ServiceLineInput = z.infer<typeof serviceLineSchema>
export type CreateClaimInput = z.infer<typeof createClaimSchema>
export type ClaimFilters = z.infer<typeof claimFiltersSchema>
