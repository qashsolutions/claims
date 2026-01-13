export type Specialty = 'ONCOLOGY' | 'MENTAL_HEALTH' | 'OBGYN' | 'ENDOCRINOLOGY'

export interface SpecialtyConfig {
  id: Specialty
  name: string
  displayName: string
  taxonomyCode: string
  commonCptCodes: string[]
  requiresAuth: string[]
}

export const SPECIALTIES: Record<Specialty, SpecialtyConfig> = {
  ONCOLOGY: {
    id: 'ONCOLOGY',
    name: 'oncology',
    displayName: 'Oncology',
    taxonomyCode: '207RH0003X',
    commonCptCodes: ['96413', '96415', '96417', '77385', '77386', '77387', '99215'],
    requiresAuth: ['96413', '96415', '96417', 'J9271', 'J9355', 'J9299'],
  },
  MENTAL_HEALTH: {
    id: 'MENTAL_HEALTH',
    name: 'mental_health',
    displayName: 'Mental Health',
    taxonomyCode: '2084P0800X',
    commonCptCodes: ['90832', '90834', '90837', '90847', '90853', '99213', '99214'],
    requiresAuth: ['90837', '90847'],
  },
  OBGYN: {
    id: 'OBGYN',
    name: 'obgyn',
    displayName: 'OB-GYN',
    taxonomyCode: '207V00000X',
    commonCptCodes: ['59400', '59510', '59610', '76801', '76805', '76811', '99213', '99214'],
    requiresAuth: ['59510', '59610'],
  },
  ENDOCRINOLOGY: {
    id: 'ENDOCRINOLOGY',
    name: 'endocrinology',
    displayName: 'Endocrinology',
    taxonomyCode: '207RE0101X',
    commonCptCodes: ['95250', '95251', '99213', '99214', '99215', '80061', '83036'],
    requiresAuth: ['95250', '95251'],
  },
}

export const getSpecialtyByTaxonomy = (taxonomyCode: string): SpecialtyConfig | undefined => {
  return Object.values(SPECIALTIES).find((s) => s.taxonomyCode === taxonomyCode)
}
