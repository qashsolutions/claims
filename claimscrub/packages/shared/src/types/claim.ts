import type { Specialty } from '../constants/specialties'

export type ClaimStatus =
  | 'DRAFT'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'PAID'
  | 'DENIED'
  | 'APPEALING'

export interface ServiceLine {
  id: string
  lineNumber: number
  cptCode: string
  cptDescription?: string
  modifiers: string[]
  icdCodes: string[]
  drugCode?: string
  drugUnits?: number
  units: number
  charge: number
}

export interface Claim {
  id: string
  claimNumber: string

  // Patient
  patientName: string
  patientDob: Date
  patientGender: 'M' | 'F' | 'O'
  insuranceId: string
  payerName: string
  payerId?: string

  // Provider
  providerNpi: string
  providerName: string

  // Service
  dateOfService: Date
  placeOfService: string
  priorAuthNumber?: string

  // Status
  status: ClaimStatus
  score?: number
  totalCharge: number

  // Relations
  practiceId: string
  createdById: string
  serviceLines: ServiceLine[]

  // Timestamps
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
}

export interface ClaimSummary {
  id: string
  claimNumber: string
  patientName: string
  dateOfService: Date
  status: ClaimStatus
  score?: number
  totalCharge: number
  serviceLineCount: number
}

export interface CreateClaimInput {
  patientName: string
  patientDob: Date
  patientGender: 'M' | 'F' | 'O'
  insuranceId: string
  payerName: string
  payerId?: string
  providerNpi: string
  providerName: string
  dateOfService: Date
  placeOfService: string
  priorAuthNumber?: string
  serviceLines: Omit<ServiceLine, 'id'>[]
}
