/**
 * Validates NPI using Luhn algorithm (ISO/IEC 7812)
 * NPI has a prefix of 80840, followed by 9 digits, with the last being a check digit
 */
export const isValidNPI = (npi: string): boolean => {
  if (!/^\d{10}$/.test(npi)) return false

  // Prepend 80840 for Luhn calculation
  const prefixedNPI = '80840' + npi

  let sum = 0
  let alternate = false

  for (let i = prefixedNPI.length - 1; i >= 0; i--) {
    let n = parseInt(prefixedNPI[i]!, 10)

    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }

    sum += n
    alternate = !alternate
  }

  return sum % 10 === 0
}

/**
 * Validates ICD-10 code format
 * Format: Letter followed by 2 digits, optionally followed by a period and 1-4 alphanumeric characters
 */
export const isValidICD10 = (code: string): boolean => {
  const pattern = /^[A-TV-Z]\d{2}(\.[A-Z0-9]{1,4})?$/i
  return pattern.test(code)
}

/**
 * Validates CPT code format
 * Format: 5 digits, may start with 0
 */
export const isValidCPT = (code: string): boolean => {
  return /^\d{5}$/.test(code)
}

/**
 * Validates HCPCS/J-code format
 * Format: Letter followed by 4 digits
 */
export const isValidHCPCS = (code: string): boolean => {
  return /^[A-Z]\d{4}$/i.test(code)
}

/**
 * Validates modifier format
 * Format: 2 alphanumeric characters
 */
export const isValidModifier = (modifier: string): boolean => {
  return /^[A-Z0-9]{2}$/i.test(modifier)
}

/**
 * Validates place of service code
 * Format: 2 digits
 */
export const isValidPlaceOfService = (pos: string): boolean => {
  return /^\d{2}$/.test(pos)
}

/**
 * Validates date is within timely filing window
 */
export const isWithinTimelyFiling = (
  dateOfService: Date,
  timelyFilingDays: number,
  referenceDate: Date = new Date()
): boolean => {
  const diffMs = referenceDate.getTime() - dateOfService.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return diffDays <= timelyFilingDays
}

/**
 * Calculates days until timely filing expires
 */
export const daysUntilTimelyFilingExpires = (
  dateOfService: Date,
  timelyFilingDays: number,
  referenceDate: Date = new Date()
): number => {
  const diffMs = referenceDate.getTime() - dateOfService.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, timelyFilingDays - diffDays)
}
