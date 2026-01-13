import type { Specialty } from '../constants/specialties'

export interface Provider {
  npi: string
  firstName: string
  lastName: string
  credential?: string
  specialty: Specialty
  practiceId: string
  taxId?: string
}

export interface Practice {
  id: string
  name: string
  npi: string
  taxId?: string
  specialty: Specialty
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
  }
  phone?: string
  epicOrgId?: string
  epicConnected: boolean
}
