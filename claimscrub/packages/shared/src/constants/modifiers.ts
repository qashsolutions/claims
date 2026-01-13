export interface Modifier {
  code: string
  name: string
  description: string
  category: 'anatomical' | 'procedural' | 'payment' | 'drug' | 'other'
  usage: string
}

export const MODIFIERS: Record<string, Modifier> = {
  '25': {
    code: '25',
    name: 'Significant E/M',
    description:
      'Significant, separately identifiable E/M service by same physician on same day of procedure',
    category: 'procedural',
    usage: 'Append to E/M code when performing same-day procedure',
  },
  '26': {
    code: '26',
    name: 'Professional Component',
    description: 'Professional component only',
    category: 'payment',
    usage: 'When billing only for professional interpretation',
  },
  '59': {
    code: '59',
    name: 'Distinct Procedural Service',
    description: 'Procedure distinct from other services on same day',
    category: 'procedural',
    usage: 'Override NCCI bundling when clinically appropriate',
  },
  JW: {
    code: 'JW',
    name: 'Drug Wastage',
    description: 'Drug amount discarded/not administered to patient',
    category: 'drug',
    usage: 'Required for Medicare when discarding unused drug portions',
  },
  XE: {
    code: 'XE',
    name: 'Separate Encounter',
    description: 'Separate encounter, distinct date of service',
    category: 'procedural',
    usage: 'More specific than 59 for separate encounter',
  },
  XP: {
    code: 'XP',
    name: 'Separate Practitioner',
    description: 'Separate practitioner',
    category: 'procedural',
    usage: 'More specific than 59 for different provider',
  },
  XS: {
    code: 'XS',
    name: 'Separate Structure',
    description: 'Separate structure',
    category: 'anatomical',
    usage: 'More specific than 59 for different anatomic structure',
  },
  XU: {
    code: 'XU',
    name: 'Unusual Non-Overlapping',
    description: 'Unusual non-overlapping service',
    category: 'procedural',
    usage: 'More specific than 59 for unique circumstances',
  },
  TC: {
    code: 'TC',
    name: 'Technical Component',
    description: 'Technical component only',
    category: 'payment',
    usage: 'When billing only for equipment and technician',
  },
  LT: {
    code: 'LT',
    name: 'Left Side',
    description: 'Left side of body',
    category: 'anatomical',
    usage: 'Identify procedure performed on left side',
  },
  RT: {
    code: 'RT',
    name: 'Right Side',
    description: 'Right side of body',
    category: 'anatomical',
    usage: 'Identify procedure performed on right side',
  },
}

export const getModifiersByCategory = (category: Modifier['category']): Modifier[] => {
  return Object.values(MODIFIERS).filter((m) => m.category === category)
}
