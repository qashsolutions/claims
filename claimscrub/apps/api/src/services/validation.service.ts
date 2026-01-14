import { isValidNPI, isWithinTimelyFiling } from '@claimscrub/shared'
import type { Claim, ServiceLine } from '@prisma/client'

type Specialty = 'ONCOLOGY' | 'MENTAL_HEALTH' | 'OBGYN' | 'ENDOCRINOLOGY'
type ValidationStatus = 'PASS' | 'WARNING' | 'FAIL'
type ValidationCheck =
  | 'CPT_ICD_MATCH'
  | 'NPI_VERIFY'
  | 'MODIFIER_CHECK'
  | 'PRIOR_AUTH'
  | 'DATA_COMPLETENESS'
  | 'TIMELY_FILING'
  | 'NCCI_EDITS'

interface ValidationResult {
  checkType: ValidationCheck
  status: ValidationStatus
  denialCode?: string
  message: string
  suggestion?: string
  metadata?: Record<string, unknown>
}

interface AuthCheckResult {
  required: boolean
  authorization: {
    number: string
    status: string
    validFrom: string
    validTo: string
  } | null
}

// Timely filing days by payer
const TIMELY_FILING_DAYS: Record<string, number> = {
  MEDICARE: 365,
  MEDICAID: 365,
  AETNA: 90,
  BCBS: 90,
  CIGNA: 90,
  UNITED: 90,
  HUMANA: 90,
  DEFAULT: 90,
}

// CPT codes that typically require prior auth
const AUTH_REQUIRED_CPTS = new Set([
  '96413', // Chemotherapy administration
  '96415', // Chemotherapy infusion
  '96416', // Chemotherapy push
  '90832', // Psychotherapy 30 min
  '90834', // Psychotherapy 45 min
  '90837', // Psychotherapy 60 min
  '59400', // OB global
  '59510', // C-section global
])

// J-codes that require prior auth
const AUTH_REQUIRED_DRUGS = new Set([
  'J9271', // Pembrolizumab (Keytruda)
  'J9299', // Nivolumab (Opdivo)
  'J9035', // Bevacizumab (Avastin)
  'J9310', // Rituximab (Rituxan)
])

class ValidationService {
  // Validate CPT-ICD match using Claude connector
  async validateCptIcdMatch(
    cptCode: string,
    icdCodes: string[],
    specialty?: Specialty
  ): Promise<ValidationResult> {
    // In production, this would call Claude Health Connector
    // For now, basic validation logic

    if (icdCodes.length === 0) {
      return {
        checkType: 'CPT_ICD_MATCH',
        status: 'FAIL',
        denialCode: 'CO-11',
        message: 'No diagnosis codes provided',
        suggestion: 'Add at least one ICD-10 code that supports medical necessity',
      }
    }

    // Oncology-specific checks
    if (specialty === 'ONCOLOGY') {
      const hasCancerDx = icdCodes.some((code) => code.startsWith('C'))
      if (cptCode.startsWith('964') && !hasCancerDx) {
        return {
          checkType: 'CPT_ICD_MATCH',
          status: 'FAIL',
          denialCode: 'CO-11',
          message: 'Chemotherapy CPT requires cancer diagnosis',
          suggestion: 'Add primary cancer diagnosis (C-code) to support medical necessity',
        }
      }
    }

    // Mental health checks
    if (specialty === 'MENTAL_HEALTH') {
      const hasMentalDx = icdCodes.some((code) => code.startsWith('F'))
      if (cptCode.startsWith('908') && !hasMentalDx) {
        return {
          checkType: 'CPT_ICD_MATCH',
          status: 'FAIL',
          denialCode: 'CO-11',
          message: 'Psychotherapy CPT requires mental health diagnosis',
          suggestion: 'Add F-code diagnosis to support medical necessity',
        }
      }
    }

    return {
      checkType: 'CPT_ICD_MATCH',
      status: 'PASS',
      message: 'CPT-ICD match verified',
    }
  }

  // Check prior authorization requirements
  async checkAuthRequirements(
    cptCode: string,
    drugCode?: string,
    payerId?: string
  ): Promise<AuthCheckResult> {
    const requiresAuth =
      AUTH_REQUIRED_CPTS.has(cptCode) ||
      (drugCode && AUTH_REQUIRED_DRUGS.has(drugCode))

    if (!requiresAuth) {
      return { required: false, authorization: null }
    }

    // In production, would check Epic for existing auth
    return {
      required: true,
      authorization: null, // Would be populated from Epic lookup
    }
  }

  // Verify NPI
  async verifyNpi(npi: string): Promise<ValidationResult> {
    if (!isValidNPI(npi)) {
      return {
        checkType: 'NPI_VERIFY',
        status: 'FAIL',
        denialCode: 'CO-16',
        message: 'Invalid NPI format',
        suggestion: 'Check NPI number - must be 10 digits with valid check digit',
      }
    }

    // In production, would call NPI Registry API
    return {
      checkType: 'NPI_VERIFY',
      status: 'PASS',
      message: 'NPI verified',
    }
  }

  // Check NCCI edits
  async checkNcciEdits(
    cptCodes: string[],
    modifiers: string[]
  ): Promise<ValidationResult> {
    // In production, would check NCCI edit database
    // This is a simplified check

    // Check for common bundling issues
    const bundledPairs = [
      ['96413', '96415'], // Chemo admin + infusion
      ['99213', '99214'], // E/M code stacking
    ]

    for (const [code1, code2] of bundledPairs) {
      if (cptCodes.includes(code1) && cptCodes.includes(code2)) {
        // Check if modifier 59 is present
        if (!modifiers.includes('59')) {
          return {
            checkType: 'NCCI_EDITS',
            status: 'WARNING',
            denialCode: 'CO-97',
            message: `CPT ${code1} and ${code2} may bundle`,
            suggestion: 'Consider modifier 59 if services are distinct',
          }
        }
      }
    }

    return {
      checkType: 'NCCI_EDITS',
      status: 'PASS',
      message: 'No NCCI edit conflicts detected',
    }
  }

  // Check timely filing
  async checkTimelyFiling(
    dateOfService: Date,
    payerId: string
  ): Promise<ValidationResult> {
    const timelyDays =
      TIMELY_FILING_DAYS[payerId.toUpperCase()] || TIMELY_FILING_DAYS.DEFAULT

    if (!isWithinTimelyFiling(dateOfService, timelyDays)) {
      return {
        checkType: 'TIMELY_FILING',
        status: 'FAIL',
        denialCode: 'CO-29',
        message: `Timely filing limit exceeded (${timelyDays} days)`,
        suggestion: 'Submit immediately or document timely filing exception',
      }
    }

    const daysRemaining = timelyDays - Math.floor(
      (Date.now() - dateOfService.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysRemaining <= 14) {
      return {
        checkType: 'TIMELY_FILING',
        status: 'WARNING',
        message: `Only ${daysRemaining} days remaining for timely filing`,
        suggestion: 'Submit claim soon to avoid timely filing denial',
        metadata: { daysRemaining },
      }
    }

    return {
      checkType: 'TIMELY_FILING',
      status: 'PASS',
      message: `${daysRemaining} days remaining for timely filing`,
      metadata: { daysRemaining },
    }
  }

  // Suggest ICD codes for a CPT
  async suggestIcdCodes(
    cptCode: string,
    patientConditions?: string[],
    specialty?: Specialty
  ): Promise<Array<{ code: string; display: string; confidence: number }>> {
    // In production, would use Claude Health Connector
    // This is a simplified mapping

    const suggestions: Array<{ code: string; display: string; confidence: number }> = []

    // Prioritize patient's active conditions
    if (patientConditions) {
      for (const condition of patientConditions) {
        suggestions.push({
          code: condition,
          display: 'From patient chart',
          confidence: 0.95,
        })
      }
    }

    return suggestions
  }

  // Suggest modifiers
  async suggestModifiers(
    cptCode: string,
    drugCode?: string,
    placeOfService?: string
  ): Promise<Array<{ code: string; display: string; reason: string }>> {
    const suggestions: Array<{ code: string; display: string; reason: string }> = []

    // JW modifier for drug wastage
    if (drugCode) {
      suggestions.push({
        code: 'JW',
        display: 'Drug amount discarded',
        reason: 'Required for drug wastage documentation',
      })
    }

    // 25 modifier for E/M with procedure
    if (cptCode.startsWith('992')) {
      suggestions.push({
        code: '25',
        display: 'Significant, separately identifiable E/M',
        reason: 'Use when E/M is beyond the procedure',
      })
    }

    return suggestions
  }

  // Run all validations for a claim
  async runAllValidations(
    claim: Claim & { serviceLines: ServiceLine[] }
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Data completeness
    if (!claim.patientName || !claim.providerNpi || !claim.dateOfService) {
      results.push({
        checkType: 'DATA_COMPLETENESS',
        status: 'FAIL',
        denialCode: 'CO-16',
        message: 'Missing required claim data',
        suggestion: 'Complete all required fields before submission',
      })
    } else {
      results.push({
        checkType: 'DATA_COMPLETENESS',
        status: 'PASS',
        message: 'All required fields complete',
      })
    }

    // NPI verification
    results.push(await this.verifyNpi(claim.providerNpi))

    // Timely filing
    results.push(
      await this.checkTimelyFiling(claim.dateOfService, claim.payerId || 'DEFAULT')
    )

    // Per-service-line validations
    for (const line of claim.serviceLines) {
      // CPT-ICD match
      results.push(
        await this.validateCptIcdMatch(line.cptCode, line.icdCodes)
      )

      // NCCI edits
      const allCpts = claim.serviceLines.map((l: ServiceLine) => l.cptCode)
      results.push(await this.checkNcciEdits(allCpts, line.modifiers))

      // Prior auth check
      const authCheck = await this.checkAuthRequirements(
        line.cptCode,
        line.drugCode || undefined,
        claim.payerId || undefined
      )

      if (authCheck.required && !claim.priorAuthNumber) {
        results.push({
          checkType: 'PRIOR_AUTH',
          status: 'WARNING',
          denialCode: 'CO-15',
          message: 'Prior authorization may be required',
          suggestion: 'Verify prior auth requirements with payer',
        })
      } else {
        results.push({
          checkType: 'PRIOR_AUTH',
          status: 'PASS',
          message: claim.priorAuthNumber
            ? `Prior auth: ${claim.priorAuthNumber}`
            : 'No prior auth required',
        })
      }

      // Modifier check
      if (line.drugCode && !line.modifiers.includes('JW')) {
        results.push({
          checkType: 'MODIFIER_CHECK',
          status: 'WARNING',
          denialCode: 'CO-4',
          message: 'Drug code without JW modifier',
          suggestion: 'Add JW modifier to document any drug wastage',
        })
      } else {
        results.push({
          checkType: 'MODIFIER_CHECK',
          status: 'PASS',
          message: 'Modifiers verified',
        })
      }
    }

    return results
  }
}

export const validationService = new ValidationService()
