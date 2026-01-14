/**
 * Guardrails Service for AskDenali
 *
 * Implements content filtering:
 * - PHI Detection: SSN, MRN, DOB patterns, names with medical context
 * - Profanity Filter: Block inappropriate language
 * - Topic Guardrails: Only allow Denali Health-related questions
 * - Language Detection: English only
 */

export interface GuardrailResult {
  allowed: boolean
  reason?: string
  sanitizedInput?: string
}

// PHI Patterns - detect protected health information
const PHI_PATTERNS = {
  SSN: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/,
  MRN: /\b(mrn|medical record|patient id|member id)[:\s#]*[\w-]+/i,
  DOB: /\b(dob|date of birth|born|birthday)[:\s]*([\d/\-]+|\w+\s+\d{1,2},?\s*\d{4})/i,
  PHONE: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  ADDRESS: /\b\d+\s+[\w\s]+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|blvd|boulevard)\b/i,
}

// Medical context keywords that indicate PHI when combined with names
const MEDICAL_CONTEXT_KEYWORDS = [
  'patient',
  'diagnosis',
  'treatment',
  'medication',
  'prescription',
  'condition',
  'symptoms',
  'surgery',
  'procedure',
  'test results',
  'lab results',
  'my doctor',
  'my appointment',
]

// Allowed topics for Denali Health questions
const ALLOWED_TOPICS = [
  // Product & Pricing
  'pricing',
  'price',
  'cost',
  'plan',
  'subscription',
  'free trial',
  'pay per claim',
  'unlimited',
  'billing',
  'payment',
  // Validation & Rules
  'validation',
  'validate',
  'rule',
  'check',
  'scrub',
  'cpt',
  'icd',
  'npi',
  'modifier',
  'ncci',
  'timely filing',
  'data completeness',
  'prior auth',
  // Denial Codes
  'denial',
  'denied',
  'rejection',
  'reject',
  'appeal',
  'co-4',
  'co-11',
  'co-15',
  'co-16',
  'co-29',
  'co-97',
  // Specialties
  'specialty',
  'oncology',
  'mental health',
  'psychiatry',
  'psychology',
  'ob-gyn',
  'obgyn',
  'obstetrics',
  'gynecology',
  'endocrinology',
  'diabetes',
  // Payers & Integration
  'payer',
  'insurance',
  'medicare',
  'medicaid',
  'aetna',
  'bcbs',
  'blue cross',
  'cigna',
  'united',
  'humana',
  'epic',
  'ehr',
  'integration',
  // General Product
  'denali',
  'claim',
  'how',
  'what',
  'why',
  'feature',
  'benefit',
  'help',
  'work',
  'start',
  'sign up',
  'register',
  'upload',
  'submit',
]

// Profanity patterns (common inappropriate words)
const PROFANITY_PATTERNS = [
  /\bf+u+c+k+/i,
  /\bs+h+i+t+/i,
  /\ba+s+s+h+o+l+e/i,
  /\bb+i+t+c+h/i,
  /\bd+a+m+n/i,
  /\bc+r+a+p/i,
  /\bp+i+s+s/i,
  /\bh+e+l+l\b/i,
  /\bb+a+s+t+a+r+d/i,
]

/**
 * Main guardrails check function
 * Returns allowed: true if message passes all checks
 */
export function checkGuardrails(input: string): GuardrailResult {
  const trimmedInput = input.trim()

  // Empty input check
  if (!trimmedInput) {
    return {
      allowed: false,
      reason: 'Please enter a message.',
    }
  }

  // Length check
  if (trimmedInput.length > 500) {
    return {
      allowed: false,
      reason: 'Message is too long. Please keep it under 500 characters.',
    }
  }

  // 1. Check for PHI
  const phiResult = detectPHI(trimmedInput)
  if (phiResult.detected) {
    return {
      allowed: false,
      reason: `I can't process messages containing personal health information (${phiResult.type}). Please rephrase without including sensitive data.`,
    }
  }

  // 2. Check for profanity
  if (containsProfanity(trimmedInput)) {
    return {
      allowed: false,
      reason:
        'Please keep the conversation professional. How can I help you learn about Denali Health?',
    }
  }

  // 3. Check language (English only)
  if (!isEnglish(trimmedInput)) {
    return {
      allowed: false,
      reason: 'I can only respond in English. Please ask your question in English.',
    }
  }

  // 4. Check topic relevance
  if (!isRelevantTopic(trimmedInput)) {
    return {
      allowed: false,
      reason:
        "I can only help with questions about Denali Health - pricing, features, validation rules, specialties, and getting started. What would you like to know about our claims scrubbing platform?",
    }
  }

  return { allowed: true, sanitizedInput: trimmedInput }
}

/**
 * Detect PHI patterns in input
 */
function detectPHI(input: string): { detected: boolean; type?: string } {
  // Check explicit PHI patterns
  for (const [type, pattern] of Object.entries(PHI_PATTERNS)) {
    if (pattern.test(input)) {
      return { detected: true, type: type.replace('_', ' ') }
    }
  }

  // Check for names in medical context
  // Pattern: Two capitalized words (likely a name)
  const hasNamePattern = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.test(input)
  const lowerInput = input.toLowerCase()
  const hasMedicalContext = MEDICAL_CONTEXT_KEYWORDS.some((kw) => lowerInput.includes(kw))

  if (hasNamePattern && hasMedicalContext) {
    return { detected: true, type: 'patient name with medical context' }
  }

  return { detected: false }
}

/**
 * Check for profanity
 */
function containsProfanity(input: string): boolean {
  return PROFANITY_PATTERNS.some((pattern) => pattern.test(input))
}

/**
 * Check if input is primarily English
 */
function isEnglish(input: string): boolean {
  // Check for common non-English character ranges
  const nonEnglishPattern = /[\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\u0600-\u06FF\uAC00-\uD7AF]/
  if (nonEnglishPattern.test(input)) {
    return false
  }

  // Check if primarily ASCII alphanumeric
  const asciiChars = input.match(/[a-zA-Z0-9\s.,!?'"-]/g) || []
  const asciiRatio = asciiChars.length / input.length
  return asciiRatio > 0.7
}

/**
 * Check if input is relevant to Denali Health
 */
function isRelevantTopic(input: string): boolean {
  const lowerInput = input.toLowerCase()

  // Always allow greetings and basic questions
  const greetings = [
    'hello',
    'hi',
    'hey',
    'help',
    'what can you',
    'how do i',
    'tell me',
    'explain',
    'thanks',
    'thank you',
  ]
  if (greetings.some((g) => lowerInput.includes(g))) {
    return true
  }

  // Check for allowed topic keywords
  return ALLOWED_TOPICS.some((topic) => lowerInput.includes(topic))
}
