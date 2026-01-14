import type { ValidationRule } from '../engine/rule-engine'
import { isWithinTimelyFiling, daysUntilTimelyFilingExpires, PAYERS } from '@claimscrub/shared'

export const timelyFilingRule: ValidationRule = {
  id: 'timely-filing',
  name: 'Timely Filing Check',
  checkType: 'TIMELY_FILING',
  description: 'Validates claim is within timely filing window for the payer',

  validate: ({ claim, now = new Date() }) => {
    // Get payer-specific timely filing limit
    const payer = claim.payerId ? PAYERS[claim.payerId] : undefined
    const timelyFilingDays = payer?.timelyFilingDays || 90 // Default to 90 days

    const isWithin = isWithinTimelyFiling(claim.dateOfService, timelyFilingDays, now)
    const daysRemaining = daysUntilTimelyFilingExpires(claim.dateOfService, timelyFilingDays, now)

    if (!isWithin) {
      return {
        status: 'FAIL',
        message: `Claim is past timely filing deadline (${timelyFilingDays} days)`,
        suggestion: 'File immediately or prepare appeal with proof of timely original submission',
        denialCode: 'CO-29',
        metadata: { daysRemaining: 0, timelyFilingDays },
      }
    }

    if (daysRemaining <= 30) {
      return {
        status: 'WARN',
        message: `Only ${daysRemaining} days remaining until timely filing deadline`,
        suggestion: 'Submit claim soon to avoid CO-29 denial',
        metadata: { daysRemaining, timelyFilingDays },
      }
    }

    return {
      status: 'PASS',
      message: `${daysRemaining} days remaining for timely filing`,
      metadata: { daysRemaining, timelyFilingDays },
    }
  },
}
