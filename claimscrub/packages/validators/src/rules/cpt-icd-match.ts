import type { ValidationRule, RuleContext } from '../engine/rule-engine'

/**
 * CPT-ICD Match Validator
 *
 * Validates that ICD-10 diagnosis codes support the medical necessity
 * of the CPT procedure codes billed on the claim.
 *
 * This is one of the most important validators as mismatched codes
 * are a leading cause of claim denials (CO-11).
 *
 * DENIAL PREVENTION:
 * - CO-11: Diagnosis inconsistent with procedure
 * - CO-50: Non-covered services
 *
 * DATA SOURCES:
 * - CMS National Correct Coding Initiative (NCCI)
 * - LCD (Local Coverage Determinations)
 * - NCD (National Coverage Determinations)
 * - Specialty-specific code mapping tables
 */

/**
 * CPT code categories with associated ICD-10 requirements.
 *
 * In production, this would be loaded from a database or
 * external data file (cpt-icd-mappings.json) with complete
 * coverage of all CPT codes and their valid ICD-10 associations.
 */
const CPT_ICD_MAPPINGS: Record<string, {
  category: string
  validIcdPrefixes: string[]
  description: string
  requiredDiagnosis?: string
}> = {
  // Oncology - Chemotherapy
  '96413': {
    category: 'Chemotherapy',
    validIcdPrefixes: ['C', 'D0', 'D1', 'D2', 'D3', 'D4'],
    description: 'Chemotherapy IV infusion requires oncology diagnosis',
  },
  '96415': {
    category: 'Chemotherapy',
    validIcdPrefixes: ['C', 'D0', 'D1', 'D2', 'D3', 'D4'],
    description: 'Chemotherapy IV infusion additional hour',
  },
  '96416': {
    category: 'Chemotherapy',
    validIcdPrefixes: ['C', 'D0', 'D1', 'D2', 'D3', 'D4'],
    description: 'Chemotherapy IV push technique',
  },

  // Mental Health - Psychotherapy
  '90832': {
    category: 'Psychotherapy',
    validIcdPrefixes: ['F'],
    description: '30-min psychotherapy requires mental health diagnosis',
  },
  '90834': {
    category: 'Psychotherapy',
    validIcdPrefixes: ['F'],
    description: '45-min psychotherapy requires mental health diagnosis',
  },
  '90837': {
    category: 'Psychotherapy',
    validIcdPrefixes: ['F'],
    description: '60-min psychotherapy requires mental health diagnosis',
  },

  // OB/GYN
  '59400': {
    category: 'Obstetrics',
    validIcdPrefixes: ['O', 'Z33', 'Z34', 'Z36', 'Z3A'],
    description: 'Routine obstetric care requires pregnancy diagnosis',
  },
  '59510': {
    category: 'Obstetrics',
    validIcdPrefixes: ['O', 'Z37'],
    description: 'C-section requires delivery-related diagnosis',
  },

  // Endocrinology
  '95250': {
    category: 'Diabetes Management',
    validIcdPrefixes: ['E08', 'E09', 'E10', 'E11', 'E13'],
    description: 'CGM monitoring requires diabetes diagnosis',
  },
  '95251': {
    category: 'Diabetes Management',
    validIcdPrefixes: ['E08', 'E09', 'E10', 'E11', 'E13'],
    description: 'CGM analysis requires diabetes diagnosis',
  },
}

/**
 * ICD-10 codes commonly associated with each CPT for suggestions.
 */
const SUGGESTED_ICD_CODES: Record<string, { code: string; description: string }[]> = {
  '96413': [
    { code: 'C50.911', description: 'Malignant neoplasm, right female breast' },
    { code: 'C34.90', description: 'Malignant neoplasm, unspecified lung' },
    { code: 'C18.9', description: 'Malignant neoplasm, colon unspecified' },
    { code: 'C61', description: 'Malignant neoplasm of prostate' },
  ],
  '90837': [
    { code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F43.10', description: 'Post-traumatic stress disorder' },
    { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  ],
}

/**
 * Checks if a given ICD-10 code is valid for the specified CPT code.
 *
 * @param cptCode - The CPT procedure code
 * @param icdCode - The ICD-10 diagnosis code
 * @returns true if the ICD code supports the CPT code
 */
function isIcdValidForCpt(cptCode: string, icdCode: string): boolean {
  const mapping = CPT_ICD_MAPPINGS[cptCode]

  // If no specific mapping exists, allow all codes (pass by default)
  if (!mapping) return true

  // Check if ICD code starts with any valid prefix
  return mapping.validIcdPrefixes.some((prefix) =>
    icdCode.toUpperCase().startsWith(prefix.toUpperCase())
  )
}

export const cptIcdMatchRule: ValidationRule = {
  id: 'cpt-icd-match',
  name: 'CPT-ICD Match',
  checkType: 'CPT_ICD_MATCH',
  description: 'Validates that diagnosis codes support the procedures billed',

  validate: ({ claim }: RuleContext) => {
    // Collect all CPT and ICD codes from service lines
    const allCptCodes: string[] = []
    const allIcdCodes: string[] = []

    for (const line of claim.serviceLines) {
      allCptCodes.push(line.cptCode)
      allIcdCodes.push(...line.icdCodes)
    }

    // Check if we have any codes to validate
    if (allCptCodes.length === 0) {
      return {
        status: 'FAIL',
        message: 'No CPT codes found on claim',
        suggestion: 'Add at least one procedure code',
        denialCode: 'CO-50',
      }
    }

    if (allIcdCodes.length === 0) {
      return {
        status: 'FAIL',
        message: 'No ICD-10 codes found on claim',
        suggestion: 'Add at least one diagnosis code to support medical necessity',
        denialCode: 'CO-11',
      }
    }

    // Validate each CPT code has supporting ICD codes
    const mismatches: {
      cptCode: string
      mapping: typeof CPT_ICD_MAPPINGS[string]
      suggestions: typeof SUGGESTED_ICD_CODES[string]
    }[] = []

    for (const cptCode of allCptCodes) {
      const mapping = CPT_ICD_MAPPINGS[cptCode]

      // Skip codes without specific mapping requirements
      if (!mapping) continue

      // Check if any ICD code supports this CPT
      const hasSupport = allIcdCodes.some((icd) => isIcdValidForCpt(cptCode, icd))

      if (!hasSupport) {
        mismatches.push({
          cptCode,
          mapping,
          suggestions: SUGGESTED_ICD_CODES[cptCode] || [],
        })
      }
    }

    // Return results based on findings
    if (mismatches.length > 0) {
      const firstMismatch = mismatches[0]
      const currentIcds = allIcdCodes.join(', ')

      return {
        status: 'FAIL',
        message: `CPT ${firstMismatch.cptCode} (${firstMismatch.mapping.category}) requires ${firstMismatch.mapping.description}. Current ICD codes: ${currentIcds}`,
        suggestion: firstMismatch.suggestions.length > 0
          ? `Suggested codes: ${firstMismatch.suggestions.map((s) => `${s.code} (${s.description})`).join(', ')}`
          : `Add an ICD-10 code starting with: ${firstMismatch.mapping.validIcdPrefixes.join(', ')}`,
        denialCode: 'CO-11',
        metadata: {
          mismatches,
          currentIcdCodes: allIcdCodes,
          suggestedCodes: firstMismatch.suggestions,
        },
      }
    }

    // All CPT codes have supporting ICD codes
    return {
      status: 'PASS',
      message: `All ${allCptCodes.length} CPT codes have supporting diagnosis codes`,
      metadata: {
        cptCodes: allCptCodes,
        icdCodes: allIcdCodes,
      },
    }
  },
}
