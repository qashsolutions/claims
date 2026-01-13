import type { ValidationRule, RuleContext } from '../engine/rule-engine'

/**
 * NCCI Edits Validator
 *
 * Validates claims against the National Correct Coding Initiative (NCCI)
 * edit tables maintained by CMS. These edits identify code pairs that
 * should not be billed together.
 *
 * DENIAL PREVENTION:
 * - CO-97: Payment adjusted based on code bundling rules
 * - CO-4: The procedure code is inconsistent with the modifier used
 *
 * NCCI EDIT TYPES:
 * 1. Column 1/Column 2 edits - Bundled codes (comprehensive/component)
 * 2. Mutually Exclusive edits - Codes that cannot be performed together
 * 3. Medically Unlikely Edits (MUE) - Maximum units per line/day
 *
 * DATA SOURCES:
 * - CMS NCCI Edit Tables (updated quarterly)
 * - NCCI PTP (Procedure-to-Procedure) edits
 * - NCCI MUE files
 */

/**
 * NCCI Column 1/Column 2 edit pairs.
 *
 * Column 1 is the comprehensive code (allowed).
 * Column 2 is the component code (bundled, not separately billable).
 *
 * In production, this would be loaded from ncci-edits.json with
 * the complete CMS NCCI edit table.
 */
const NCCI_COLUMN_EDITS: Record<string, {
  bundledCodes: string[]
  modifierAllowed: boolean
  effectiveDate: string
}> = {
  // Chemotherapy administration bundles
  '96413': {
    bundledCodes: ['96360', '96361', '96365', '96366'],
    modifierAllowed: true,
    effectiveDate: '2024-01-01',
  },
  '96415': {
    bundledCodes: ['96360', '96361'],
    modifierAllowed: true,
    effectiveDate: '2024-01-01',
  },

  // E/M with procedures
  '99213': {
    bundledCodes: ['99211', '99212'],
    modifierAllowed: false,
    effectiveDate: '2024-01-01',
  },
  '99214': {
    bundledCodes: ['99211', '99212', '99213'],
    modifierAllowed: false,
    effectiveDate: '2024-01-01',
  },

  // Mental health
  '90837': {
    bundledCodes: ['90832', '90834'],
    modifierAllowed: false,
    effectiveDate: '2024-01-01',
  },
}

/**
 * Mutually exclusive code pairs.
 *
 * These codes represent procedures that cannot reasonably
 * be performed during the same session.
 */
const MUTUALLY_EXCLUSIVE_EDITS: Array<{
  code1: string
  code2: string
  reason: string
}> = [
  {
    code1: '59400',
    code2: '59510',
    reason: 'Cannot bill routine OB care with C-section global package',
  },
  {
    code1: '90834',
    code2: '90837',
    reason: 'Cannot bill multiple time-based psychotherapy codes same session',
  },
]

/**
 * Medically Unlikely Edits (MUE) - Maximum units per procedure.
 *
 * These limits prevent billing excessive units that would be
 * medically implausible for a single patient encounter.
 */
const MUE_LIMITS: Record<string, {
  maxUnits: number
  rationale: string
  adjudicationType: 'claim' | 'line' | 'day'
}> = {
  '96413': {
    maxUnits: 1,
    rationale: 'First hour of chemo administration - once per day',
    adjudicationType: 'day',
  },
  '96415': {
    maxUnits: 8,
    rationale: 'Additional hours of chemo - limited to 8 hours',
    adjudicationType: 'day',
  },
  '90837': {
    maxUnits: 2,
    rationale: '60-min psychotherapy limited to 2 per day',
    adjudicationType: 'day',
  },
  '99214': {
    maxUnits: 1,
    rationale: 'Office visit - one per day per patient',
    adjudicationType: 'day',
  },
}

/**
 * Checks for NCCI Column 1/Column 2 edit violations.
 */
function checkColumnEdits(cptCodes: string[]): {
  violation: boolean
  details?: {
    column1Code: string
    column2Code: string
    modifierAllowed: boolean
  }
} {
  for (const code of cptCodes) {
    const edit = NCCI_COLUMN_EDITS[code]
    if (!edit) continue

    // Check if any bundled code is also present
    for (const bundledCode of edit.bundledCodes) {
      if (cptCodes.includes(bundledCode)) {
        return {
          violation: true,
          details: {
            column1Code: code,
            column2Code: bundledCode,
            modifierAllowed: edit.modifierAllowed,
          },
        }
      }
    }
  }

  return { violation: false }
}

/**
 * Checks for mutually exclusive code violations.
 */
function checkMutuallyExclusive(cptCodes: string[]): {
  violation: boolean
  details?: {
    code1: string
    code2: string
    reason: string
  }
} {
  for (const edit of MUTUALLY_EXCLUSIVE_EDITS) {
    if (cptCodes.includes(edit.code1) && cptCodes.includes(edit.code2)) {
      return {
        violation: true,
        details: {
          code1: edit.code1,
          code2: edit.code2,
          reason: edit.reason,
        },
      }
    }
  }

  return { violation: false }
}

/**
 * Checks for Medically Unlikely Edit (MUE) violations.
 */
function checkMueViolations(
  serviceLines: Array<{ cptCode: string; units: number }>
): {
  violation: boolean
  details?: {
    code: string
    units: number
    maxUnits: number
    rationale: string
  }
} {
  // Aggregate units by CPT code
  const unitsByCode: Record<string, number> = {}
  for (const line of serviceLines) {
    unitsByCode[line.cptCode] = (unitsByCode[line.cptCode] || 0) + line.units
  }

  // Check each code against MUE limits
  for (const [code, totalUnits] of Object.entries(unitsByCode)) {
    const mue = MUE_LIMITS[code]
    if (mue && totalUnits > mue.maxUnits) {
      return {
        violation: true,
        details: {
          code,
          units: totalUnits,
          maxUnits: mue.maxUnits,
          rationale: mue.rationale,
        },
      }
    }
  }

  return { violation: false }
}

export const ncciEditsRule: ValidationRule = {
  id: 'ncci-edits',
  name: 'NCCI Edits',
  checkType: 'NCCI_EDITS',
  description: 'Validates claim against NCCI bundling and MUE rules',

  validate: ({ claim }: RuleContext) => {
    // Collect all CPT codes and units from service lines
    const cptCodes = claim.serviceLines.map((line) => line.cptCode)
    const serviceLines = claim.serviceLines.map((line) => ({
      cptCode: line.cptCode,
      units: line.units,
    }))

    // Check 1: Column 1/Column 2 edits (code bundling)
    const columnEdit = checkColumnEdits(cptCodes)
    if (columnEdit.violation && columnEdit.details) {
      const { column1Code, column2Code, modifierAllowed } = columnEdit.details

      return {
        status: modifierAllowed ? 'WARNING' : 'FAIL',
        message: `NCCI edit: CPT ${column2Code} is bundled into CPT ${column1Code}`,
        suggestion: modifierAllowed
          ? `Add modifier 59 or XE/XP/XS/XU to ${column2Code} if services were distinct`
          : `Remove ${column2Code} as it is included in ${column1Code}`,
        denialCode: 'CO-97',
        metadata: {
          editType: 'column1_column2',
          ...columnEdit.details,
        },
      }
    }

    // Check 2: Mutually exclusive codes
    const mutexEdit = checkMutuallyExclusive(cptCodes)
    if (mutexEdit.violation && mutexEdit.details) {
      return {
        status: 'FAIL',
        message: `Mutually exclusive codes: ${mutexEdit.details.code1} and ${mutexEdit.details.code2} cannot be billed together`,
        suggestion: mutexEdit.details.reason,
        denialCode: 'CO-97',
        metadata: {
          editType: 'mutually_exclusive',
          ...mutexEdit.details,
        },
      }
    }

    // Check 3: Medically Unlikely Edits (MUE)
    const mueViolation = checkMueViolations(serviceLines)
    if (mueViolation.violation && mueViolation.details) {
      return {
        status: 'WARNING',
        message: `MUE exceeded: CPT ${mueViolation.details.code} billed with ${mueViolation.details.units} units (max: ${mueViolation.details.maxUnits})`,
        suggestion: `${mueViolation.details.rationale}. Reduce units to ${mueViolation.details.maxUnits} or document medical necessity for appeal`,
        denialCode: 'CO-97',
        metadata: {
          editType: 'mue',
          ...mueViolation.details,
        },
      }
    }

    // All NCCI checks passed
    return {
      status: 'PASS',
      message: `No NCCI edit violations found for ${cptCodes.length} procedure codes`,
      metadata: {
        checkedCodes: cptCodes,
      },
    }
  },
}
