export interface Patient {
  id: string
  mrn: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: 'M' | 'F' | 'O'
  address?: Address
  phone?: string
  email?: string
  insurance: Insurance
  activeDiagnoses: Diagnosis[]
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
}

export interface Insurance {
  payerId: string
  payerName: string
  memberId: string
  groupNumber?: string
  planType: 'MEDICARE' | 'MEDICAID' | 'COMMERCIAL' | 'SELF_PAY'
  isPrimary: boolean
}

export interface Diagnosis {
  code: string
  description: string
  type: 'PRIMARY' | 'SECONDARY'
  onsetDate?: Date
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC'
}
