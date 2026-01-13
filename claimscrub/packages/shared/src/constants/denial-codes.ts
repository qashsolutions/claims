export interface DenialCode {
  code: string
  name: string
  category: 'CO' | 'PR' | 'OA' | 'PI' | 'CR'
  description: string
  commonCauses: string[]
  preventionTips: string[]
}

export const DENIAL_CODES: Record<string, DenialCode> = {
  'CO-4': {
    code: 'CO-4',
    name: 'Modifier Required',
    category: 'CO',
    description: 'The procedure code is inconsistent with the modifier used.',
    commonCauses: [
      'Missing modifier (e.g., JW for drug wastage)',
      'Incorrect modifier combination',
      'Modifier not supported for procedure',
    ],
    preventionTips: [
      'Verify modifier requirements for each CPT code',
      'Check payer-specific modifier rules',
      'Use JW modifier when drug wastage occurs',
    ],
  },
  'CO-11': {
    code: 'CO-11',
    name: 'Diagnosis Mismatch',
    category: 'CO',
    description: 'The diagnosis is inconsistent with the procedure.',
    commonCauses: [
      'CPT code does not match ICD-10 diagnosis',
      'Missing secondary diagnosis',
      'Unspecified diagnosis code used',
    ],
    preventionTips: [
      'Validate CPT-ICD pairing before submission',
      'Use most specific ICD-10 code available',
      'Include all relevant diagnoses',
    ],
  },
  'CO-15': {
    code: 'CO-15',
    name: 'Authorization Required',
    category: 'CO',
    description: 'The authorization number is missing, invalid, or does not apply.',
    commonCauses: [
      'Prior authorization not obtained',
      'Authorization expired',
      'Authorization for different service',
    ],
    preventionTips: [
      'Check authorization requirements before service',
      'Verify authorization is active on date of service',
      'Include valid authorization number on claim',
    ],
  },
  'CO-16': {
    code: 'CO-16',
    name: 'Missing Information',
    category: 'CO',
    description: 'Claim/service lacks information needed for adjudication.',
    commonCauses: [
      'Missing patient demographics',
      'Missing provider NPI',
      'Incomplete service line data',
    ],
    preventionTips: [
      'Complete all required fields',
      'Verify NPI validity',
      'Include all service details',
    ],
  },
  'CO-29': {
    code: 'CO-29',
    name: 'Timely Filing',
    category: 'CO',
    description: 'The time limit for filing has expired.',
    commonCauses: [
      'Claim submitted after filing deadline',
      'Delayed from payer rejection correction',
      'Coordination of benefits delays',
    ],
    preventionTips: [
      'Submit claims within 30 days of service',
      'Track payer-specific filing limits',
      'Appeal with proof of timely original submission',
    ],
  },
  'CO-97': {
    code: 'CO-97',
    name: 'Bundled Procedure',
    category: 'CO',
    description: 'Payment included in allowance for another service/procedure.',
    commonCauses: [
      'NCCI edit violation',
      'Procedures billed separately that should be bundled',
      'Missing modifier to unbundle',
    ],
    preventionTips: [
      'Check NCCI edits before billing',
      'Use modifier 59/XE/XP/XS/XU when appropriate',
      'Bill comprehensive codes',
    ],
  },
}

export const getDenialCode = (code: string): DenialCode | undefined => {
  return DENIAL_CODES[code]
}

export const getDenialsByCategory = (category: DenialCode['category']): DenialCode[] => {
  return Object.values(DENIAL_CODES).filter((d) => d.category === category)
}
