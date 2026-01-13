export interface EpicTokens {
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  scope: string
  patientId?: string
}

export interface EpicPatient {
  id: string
  identifier: {
    mrn: string
    ssn?: string
  }
  name: {
    given: string[]
    family: string
  }
  birthDate: string
  gender: 'male' | 'female' | 'other' | 'unknown'
  address?: {
    line: string[]
    city: string
    state: string
    postalCode: string
  }
  telecom?: {
    system: 'phone' | 'email'
    value: string
    use: 'home' | 'work' | 'mobile'
  }[]
}

export interface EpicCondition {
  id: string
  code: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  clinicalStatus: {
    coding: {
      code: 'active' | 'resolved' | 'inactive'
    }[]
  }
  onsetDateTime?: string
  recordedDate?: string
}

export interface EpicCoverage {
  id: string
  status: 'active' | 'cancelled' | 'entered-in-error'
  subscriberId: string
  payor: {
    display: string
    identifier?: string
  }
  class?: {
    type: string
    value: string
    name?: string
  }[]
}

export interface EpicAuthorization {
  id: string
  authNumber: string
  status: 'active' | 'expired' | 'pending'
  validFrom: string
  validTo: string
  authorizedUnits: number
  usedUnits: number
  serviceCode?: string
  drugCode?: string
}
