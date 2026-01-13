export type PayerType = 'MEDICARE' | 'MEDICAID' | 'COMMERCIAL' | 'SELF_PAY'

export interface Payer {
  id: string
  name: string
  type: PayerType
  timelyFilingDays: number
  priorAuthPortal?: string
  claimPortal?: string
}

export const PAYERS: Record<string, Payer> = {
  MEDICARE_A: {
    id: 'MEDICARE_A',
    name: 'Medicare Part A',
    type: 'MEDICARE',
    timelyFilingDays: 365,
    claimPortal: 'https://www.cms.gov/medicare',
  },
  MEDICARE_B: {
    id: 'MEDICARE_B',
    name: 'Medicare Part B',
    type: 'MEDICARE',
    timelyFilingDays: 365,
    claimPortal: 'https://www.cms.gov/medicare',
  },
  MEDICARE_D: {
    id: 'MEDICARE_D',
    name: 'Medicare Part D',
    type: 'MEDICARE',
    timelyFilingDays: 365,
    claimPortal: 'https://www.cms.gov/medicare',
  },
  AETNA: {
    id: 'AETNA',
    name: 'Aetna',
    type: 'COMMERCIAL',
    timelyFilingDays: 90,
    priorAuthPortal: 'https://www.aetna.com/providers',
    claimPortal: 'https://www.availity.com',
  },
  BCBS: {
    id: 'BCBS',
    name: 'Blue Cross Blue Shield',
    type: 'COMMERCIAL',
    timelyFilingDays: 90,
    priorAuthPortal: 'https://www.bcbs.com/providers',
    claimPortal: 'https://www.availity.com',
  },
  CIGNA: {
    id: 'CIGNA',
    name: 'Cigna',
    type: 'COMMERCIAL',
    timelyFilingDays: 90,
    priorAuthPortal: 'https://cignaforhcp.cigna.com',
    claimPortal: 'https://www.availity.com',
  },
  UNITED: {
    id: 'UNITED',
    name: 'UnitedHealthcare',
    type: 'COMMERCIAL',
    timelyFilingDays: 90,
    priorAuthPortal: 'https://www.uhcprovider.com',
    claimPortal: 'https://www.availity.com',
  },
  HUMANA: {
    id: 'HUMANA',
    name: 'Humana',
    type: 'COMMERCIAL',
    timelyFilingDays: 90,
    priorAuthPortal: 'https://www.humana.com/provider',
    claimPortal: 'https://www.availity.com',
  },
}

export const getPayerById = (id: string): Payer | undefined => {
  return PAYERS[id]
}

export const getPayersByType = (type: PayerType): Payer[] => {
  return Object.values(PAYERS).filter((p) => p.type === type)
}
