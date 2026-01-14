/**
 * Knowledge Base Builder for AskDenali
 *
 * Dynamically builds context from actual code constants:
 * - Validation rules descriptions
 * - Pricing plans (matching landing page)
 * - Specialties from @claimscrub/shared/constants
 * - Denial codes from @claimscrub/shared/constants
 * - Payers from @claimscrub/shared/constants
 */

console.log('[AskDenali KnowledgeBase] Loading module...')

let SPECIALTIES: Record<string, { displayName: string; commonCptCodes: string[] }> = {}
let DENIAL_CODES: Record<string, { code: string; name: string; description: string; preventionTips: string[] }> = {}
let PAYERS: Record<string, { name: string; type: string; timelyFilingDays: number }> = {}

try {
  const constants = await import('@claimscrub/shared/constants')
  SPECIALTIES = constants.SPECIALTIES || {}
  DENIAL_CODES = constants.DENIAL_CODES || {}
  PAYERS = constants.PAYERS || {}
  console.log('[AskDenali KnowledgeBase] Constants loaded successfully')
  console.log('[AskDenali KnowledgeBase] SPECIALTIES count:', Object.keys(SPECIALTIES).length)
  console.log('[AskDenali KnowledgeBase] DENIAL_CODES count:', Object.keys(DENIAL_CODES).length)
  console.log('[AskDenali KnowledgeBase] PAYERS count:', Object.keys(PAYERS).length)
} catch (error) {
  console.error('[AskDenali KnowledgeBase] Failed to load constants:', error)
}

// Validation rules (from packages/validators/src/rules/)
const VALIDATION_RULES = {
  CPT_ICD_MATCH: {
    name: 'CPT-ICD Match',
    description: 'Validates that diagnosis codes support the procedures billed',
    denialPrevention: 'Prevents CO-11 (Diagnosis inconsistent with procedure) denials',
  },
  NPI_VERIFY: {
    name: 'NPI Validator',
    description: 'Validates provider NPI using the Luhn algorithm checksum',
    denialPrevention: 'Prevents CO-16 (Missing/invalid information) denials',
  },
  MODIFIER_CHECK: {
    name: 'Modifier Rules',
    description: 'Validates correct modifier usage and checks for conflicts',
    denialPrevention: 'Prevents CO-4 (Modifier inconsistent) denials',
  },
  PRIOR_AUTH: {
    name: 'Prior Authorization',
    description: 'Checks if procedures require prior authorization based on CPT codes',
    denialPrevention: 'Prevents CO-15 (Authorization required) denials',
  },
  DATA_COMPLETENESS: {
    name: 'Data Completeness',
    description: 'Ensures all required claim fields are populated (patient, provider, service)',
    denialPrevention: 'Prevents CO-16 (Missing information) denials',
  },
  TIMELY_FILING: {
    name: 'Timely Filing',
    description: 'Validates claim is within payer-specific filing deadline',
    denialPrevention: 'Prevents CO-29 (Filing limit expired) denials',
  },
  NCCI_EDITS: {
    name: 'NCCI Edits',
    description: 'Checks for bundled procedures and NCCI edit violations',
    denialPrevention: 'Prevents CO-97 (Bundled procedure) denials',
  },
}

// Pricing (matching landing page exactly)
const PRICING = {
  FREE_TRIAL: {
    name: 'Free Trial',
    price: '$0 for 3 days',
    limits: '1 claim per day',
    features: ['All 4 specialties', 'All 7 validation rules', 'Email support'],
  },
  PAY_PER_CLAIM: {
    name: 'Pay Per Claim',
    price: '$10 per claim',
    limits: 'Unlimited claims',
    features: ['All 4 specialties', 'All 7 validation rules', 'Email support'],
  },
  UNLIMITED: {
    name: 'Unlimited',
    price: '$100/month ($70/month with annual billing)',
    limits: 'Unlimited claims',
    features: [
      'All 4 specialties',
      'All 7 validation rules',
      'Priority support',
      'Epic EHR integration',
      'Analytics dashboard (in progress)',
    ],
  },
}

/**
 * Build the complete knowledge base as a formatted string
 */
export function buildKnowledgeBase(): string {
  console.log('[AskDenali KnowledgeBase] buildKnowledgeBase() called')

  try {
    const sections = [
      buildAboutSection(),
      buildValidationSection(),
      buildPricingSection(),
      buildSpecialtiesSection(),
      buildDenialCodesSection(),
      buildPayersSection(),
      buildGettingStartedSection(),
    ]

    const result = sections.join('\n\n')
    console.log('[AskDenali KnowledgeBase] Knowledge base built successfully, length:', result.length)
    return result
  } catch (error) {
    console.error('[AskDenali KnowledgeBase] Error building knowledge base:', error)
    throw error
  }
}

function buildAboutSection(): string {
  return `## About Denali Health
Denali Health is a healthcare claims scrubbing application that helps medical practices prevent claim denials before submission.

Key benefits:
- Catches billing errors before you submit claims
- Reduces denial rates by validating against 7 rules
- Saves time on manual claim reviews
- Supports 4 medical specialties
- Integrates with Epic EHR (Unlimited plan only)

Our focus is Denials PREVENTION, not Denials Management. We help you submit clean claims the first time.`
}

function buildValidationSection(): string {
  const rules = Object.values(VALIDATION_RULES)
    .map((r) => `- ${r.name}: ${r.description}. ${r.denialPrevention}`)
    .join('\n')

  return `## Validation Rules
Denali Health runs 7 validation checks on every claim:

${rules}

Each rule is designed to catch a specific type of error before submission.`
}

function buildPricingSection(): string {
  const plans = Object.values(PRICING)
    .map((p) => {
      const features = p.features.join(', ')
      return `- ${p.name}: ${p.price}. ${p.limits}. Includes: ${features}`
    })
    .join('\n')

  return `## Pricing Plans
${plans}

Annual billing saves 30% on the Unlimited plan ($840/year instead of $1,200/year).
No credit card required for the free trial.`
}

function buildSpecialtiesSection(): string {
  const specs = Object.values(SPECIALTIES)
    .map((s) => {
      const codes = s.commonCptCodes.slice(0, 4).join(', ')
      return `- ${s.displayName}: Common CPT codes include ${codes}`
    })
    .join('\n')

  return `## Supported Specialties
We support 4 medical specialties with specialty-specific validation rules:

${specs}

Each specialty has custom CPT-ICD mappings, modifier requirements, and prior authorization rules.`
}

function buildDenialCodesSection(): string {
  const codes = Object.values(DENIAL_CODES)
    .map((d) => {
      const tip = d.preventionTips[0]
      return `- ${d.code} (${d.name}): ${d.description} Prevention tip: ${tip}`
    })
    .join('\n')

  return `## Common Denial Codes We Prevent
${codes}

Our validation rules are specifically designed to prevent these common denial codes.`
}

function buildPayersSection(): string {
  const medicare = Object.values(PAYERS)
    .filter((p) => p.type === 'MEDICARE')
    .map((p) => `${p.name} (${p.timelyFilingDays}-day filing limit)`)
    .join(', ')

  const commercial = Object.values(PAYERS)
    .filter((p) => p.type === 'COMMERCIAL')
    .map((p) => `${p.name} (${p.timelyFilingDays}-day filing limit)`)
    .join(', ')

  return `## Supported Payers
Medicare: ${medicare}
Commercial: ${commercial}

Our timely filing validation automatically uses the correct filing deadline for each payer.`
}

function buildGettingStartedSection(): string {
  return `## Getting Started
1. Sign up for a free 3-day trial at denalihealth.com (no credit card required)
2. Upload your first claim (supports PDF, 837, CSV formats)
3. Review validation results and see which rules passed or failed
4. Fix any issues using our actionable suggestions
5. Submit clean claims with confidence

For the Unlimited plan, you can also integrate with Epic EHR to pull patient data directly.`
}
