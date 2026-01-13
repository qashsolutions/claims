export interface PlaceOfService {
  code: string
  name: string
  description: string
}

export const PLACE_OF_SERVICE: Record<string, PlaceOfService> = {
  '11': {
    code: '11',
    name: 'Office',
    description: 'Location where health professionals routinely provide services',
  },
  '12': {
    code: '12',
    name: 'Home',
    description: "Patient's home",
  },
  '19': {
    code: '19',
    name: 'Off Campus-Outpatient Hospital',
    description: 'Off campus outpatient hospital department',
  },
  '21': {
    code: '21',
    name: 'Inpatient Hospital',
    description: 'Hospital inpatient facility',
  },
  '22': {
    code: '22',
    name: 'On Campus-Outpatient Hospital',
    description: 'Hospital outpatient facility on campus',
  },
  '23': {
    code: '23',
    name: 'Emergency Room',
    description: 'Hospital emergency department',
  },
  '24': {
    code: '24',
    name: 'Ambulatory Surgical Center',
    description: 'Freestanding ambulatory surgical center',
  },
  '31': {
    code: '31',
    name: 'Skilled Nursing Facility',
    description: 'Skilled nursing facility for rehabilitation',
  },
  '32': {
    code: '32',
    name: 'Nursing Facility',
    description: 'Long-term care nursing facility',
  },
  '49': {
    code: '49',
    name: 'Independent Clinic',
    description: 'Freestanding clinic not part of hospital',
  },
  '50': {
    code: '50',
    name: 'Federally Qualified Health Center',
    description: 'FQHC providing comprehensive primary care',
  },
  '53': {
    code: '53',
    name: 'Community Mental Health Center',
    description: 'Community-based mental health facility',
  },
}

export const getPlaceOfService = (code: string): PlaceOfService | undefined => {
  return PLACE_OF_SERVICE[code]
}
