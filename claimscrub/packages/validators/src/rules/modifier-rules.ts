import type { ValidationRule, RuleContext } from '../engine/rule-engine'

/**
 * Modifier Rules Validator
 *
 * Validates the appropriate use of CPT modifiers on claims.
 * Modifiers provide additional information about the service
 * performed and affect reimbursement.
 *
 * DENIAL PREVENTION:
 * - CO-4: The procedure code is inconsistent with the modifier
 * - CO-109: Claim not covered by this payer/contractor
 * - CO-97: Payment adjusted based on modifier
 *
 * MODIFIER CATEGORIES:
 * 1. Anatomical - Indicate body location (LT, RT, 50)
 * 2. Global - Affect global surgical package (24, 25, 57, 58, 59)
 * 3. Level of Service - Modify E/M complexity (21, 22)
 * 4. Drug-related - Drug wastage and administration (JW, JZ)
 * 5. Provider-related - Indicate provider type (AS, GC, GE)
 *
 * DATA SOURCES:
 * - CPT modifier guidelines (AMA)
 * - CMS modifier policy manual
 * - Specialty-specific modifier requirements
 */

/**
 * Modifier definitions with validation rules.
 *
 * In production, this would be loaded from modifier-rules.json
 * with complete coverage of all CMS-recognized modifiers.
 */
interface ModifierRule {
  code: string
  name: string
  description: string
  applicableCpts?: string[]
  excludedCpts?: string[]
  requiresDocumentation?: boolean
  incompatibleModifiers?: string[]
  reduceReimbursement?: number // Percentage
  requiresAnatomicalSide?: boolean
}

const MODIFIER_RULES: Record<string, ModifierRule> = {
  // Anatomical modifiers
  'LT': {
    code: 'LT',
    name: 'Left Side',
    description: 'Indicates procedure performed on left side of body',
    incompatibleModifiers: ['RT', '50'],
    requiresAnatomicalSide: true,
  },
  'RT': {
    code: 'RT',
    name: 'Right Side',
    description: 'Indicates procedure performed on right side of body',
    incompatibleModifiers: ['LT', '50'],
    requiresAnatomicalSide: true,
  },
  '50': {
    code: '50',
    name: 'Bilateral Procedure',
    description: 'Same procedure performed on both sides',
    incompatibleModifiers: ['LT', 'RT'],
    reduceReimbursement: 50, // 150% of single procedure rate
  },

  // NCCI modifiers (unbundling)
  '59': {
    code: '59',
    name: 'Distinct Procedural Service',
    description: 'Identifies distinct procedure not normally reported together',
    requiresDocumentation: true,
  },
  'XE': {
    code: 'XE',
    name: 'Separate Encounter',
    description: 'Service was separate encounter',
    incompatibleModifiers: ['59', 'XP', 'XS', 'XU'],
  },
  'XP': {
    code: 'XP',
    name: 'Separate Practitioner',
    description: 'Service was separate practitioner',
    incompatibleModifiers: ['59', 'XE', 'XS', 'XU'],
  },
  'XS': {
    code: 'XS',
    name: 'Separate Structure',
    description: 'Service was separate organ/structure',
    incompatibleModifiers: ['59', 'XE', 'XP', 'XU'],
  },
  'XU': {
    code: 'XU',
    name: 'Unusual Non-Overlapping Service',
    description: 'Service was unusual and non-overlapping',
    incompatibleModifiers: ['59', 'XE', 'XP', 'XS'],
  },

  // Drug-related modifiers
  'JW': {
    code: 'JW',
    name: 'Drug Amount Discarded/Not Administered',
    description: 'Indicates discarded portion of drug',
    requiresDocumentation: true,
  },
  'JZ': {
    code: 'JZ',
    name: 'No Drug Wastage',
    description: 'Certifies that no drug was discarded',
    incompatibleModifiers: ['JW'],
  },

  // Professional component modifiers
  '26': {
    code: '26',
    name: 'Professional Component',
    description: 'Professional component only',
    incompatibleModifiers: ['TC'],
  },
  'TC': {
    code: 'TC',
    name: 'Technical Component',
    description: 'Technical component only',
    incompatibleModifiers: ['26'],
  },

  // E/M modifiers
  '25': {
    code: '25',
    name: 'Significant E/M Service',
    description: 'Significant E/M service same day as procedure',
    applicableCpts: ['99201', '99202', '99203', '99204', '99205', '99211', '99212', '99213', '99214', '99215'],
    requiresDocumentation: true,
  },

  // Global surgery modifiers
  '24': {
    code: '24',
    name: 'Unrelated E/M During Postop',
    description: 'Unrelated E/M service during postoperative period',
    requiresDocumentation: true,
  },
  '57': {
    code: '57',
    name: 'Decision for Surgery',
    description: 'E/M service that resulted in decision to perform surgery',
    applicableCpts: ['99201', '99202', '99203', '99204', '99205', '99211', '99212', '99213', '99214', '99215'],
  },
}

/**
 * CPT codes that require specific modifiers.
 */
const REQUIRED_MODIFIERS: Record<string, {
  requiredModifiers: string[]
  condition: string
}> = {
  // Bilateral procedures often need LT/RT or 50
  '27447': {
    requiredModifiers: ['LT', 'RT', '50'],
    condition: 'Knee arthroplasty requires anatomical modifier',
  },
  // Drug administration may need JW or JZ
  'J9271': {
    requiredModifiers: ['JW', 'JZ'],
    condition: 'Injectable drugs may require wastage modifier for some payers',
  },
}

/**
 * Validates modifier compatibility within a modifier set.
 */
function checkModifierCompatibility(modifiers: string[]): {
  valid: boolean
  conflict?: {
    modifier1: string
    modifier2: string
    reason: string
  }
} {
  for (const modifier of modifiers) {
    const rule = MODIFIER_RULES[modifier]
    if (!rule || !rule.incompatibleModifiers) continue

    for (const incompatible of rule.incompatibleModifiers) {
      if (modifiers.includes(incompatible)) {
        return {
          valid: false,
          conflict: {
            modifier1: modifier,
            modifier2: incompatible,
            reason: `${rule.name} (${modifier}) cannot be used with ${MODIFIER_RULES[incompatible]?.name || incompatible} (${incompatible})`,
          },
        }
      }
    }
  }

  return { valid: true }
}

/**
 * Validates modifier applicability to CPT code.
 */
function checkModifierApplicability(
  cptCode: string,
  modifier: string
): { valid: boolean; reason?: string } {
  const rule = MODIFIER_RULES[modifier]
  if (!rule) return { valid: true } // Unknown modifier, pass through

  // Check if modifier is only for specific CPT codes
  if (rule.applicableCpts && !rule.applicableCpts.includes(cptCode)) {
    return {
      valid: false,
      reason: `Modifier ${modifier} (${rule.name}) is not applicable to CPT ${cptCode}`,
    }
  }

  // Check if modifier is excluded for this CPT
  if (rule.excludedCpts && rule.excludedCpts.includes(cptCode)) {
    return {
      valid: false,
      reason: `Modifier ${modifier} (${rule.name}) cannot be used with CPT ${cptCode}`,
    }
  }

  return { valid: true }
}

export const modifierRulesRule: ValidationRule = {
  id: 'modifier-rules',
  name: 'Modifier Validation',
  checkType: 'MODIFIER_CHECK',
  description: 'Validates appropriate use of CPT modifiers',

  validate: ({ claim }: RuleContext) => {
    const issues: Array<{
      type: 'error' | 'warning'
      message: string
      line?: number
    }> = []

    // Check each service line
    for (let i = 0; i < claim.serviceLines.length; i++) {
      const line = claim.serviceLines[i]
      const modifiers = line.modifiers || []
      const lineNum = i + 1

      // Check 1: Modifier compatibility within the line
      const compatibility = checkModifierCompatibility(modifiers)
      if (!compatibility.valid && compatibility.conflict) {
        issues.push({
          type: 'error',
          message: `Line ${lineNum}: ${compatibility.conflict.reason}`,
          line: lineNum,
        })
      }

      // Check 2: Modifier applicability to CPT code
      for (const modifier of modifiers) {
        const applicability = checkModifierApplicability(line.cptCode, modifier)
        if (!applicability.valid) {
          issues.push({
            type: 'error',
            message: `Line ${lineNum}: ${applicability.reason}`,
            line: lineNum,
          })
        }
      }

      // Check 3: Required modifiers
      const required = REQUIRED_MODIFIERS[line.cptCode]
      if (required) {
        const hasRequired = required.requiredModifiers.some((m) => modifiers.includes(m))
        if (!hasRequired) {
          issues.push({
            type: 'warning',
            message: `Line ${lineNum}: ${required.condition}. Consider adding one of: ${required.requiredModifiers.join(', ')}`,
            line: lineNum,
          })
        }
      }

      // Check 4: Documentation requirements
      for (const modifier of modifiers) {
        const rule = MODIFIER_RULES[modifier]
        if (rule?.requiresDocumentation) {
          issues.push({
            type: 'warning',
            message: `Line ${lineNum}: Modifier ${modifier} (${rule.name}) requires supporting documentation`,
            line: lineNum,
          })
        }
      }
    }

    // Return results based on findings
    const errors = issues.filter((i) => i.type === 'error')
    const warnings = issues.filter((i) => i.type === 'warning')

    if (errors.length > 0) {
      return {
        status: 'FAIL',
        message: errors[0].message,
        suggestion: 'Review modifier usage and remove incompatible or inapplicable modifiers',
        denialCode: 'CO-4',
        metadata: {
          errors,
          warnings,
        },
      }
    }

    if (warnings.length > 0) {
      return {
        status: 'WARNING',
        message: warnings[0].message,
        suggestion: 'Ensure documentation supports modifier usage',
        metadata: {
          warnings,
        },
      }
    }

    // All modifier checks passed
    const totalModifiers = claim.serviceLines.reduce(
      (sum, line) => sum + (line.modifiers?.length || 0),
      0
    )

    return {
      status: 'PASS',
      message: totalModifiers > 0
        ? `${totalModifiers} modifiers validated across ${claim.serviceLines.length} service lines`
        : 'No modifiers present on claim',
    }
  },
}
