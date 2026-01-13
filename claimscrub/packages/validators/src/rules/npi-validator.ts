import type { ValidationRule } from '../engine/rule-engine'
import { isValidNPI } from '@claimscrub/shared'

export const npiValidatorRule: ValidationRule = {
  id: 'npi-validator',
  name: 'NPI Validator',
  checkType: 'NPI_VERIFY',
  description: 'Validates the provider NPI using Luhn algorithm',

  validate: ({ claim }) => {
    if (!claim.providerNpi) {
      return {
        status: 'FAIL',
        message: 'Provider NPI is missing',
        suggestion: 'Add a valid 10-digit NPI',
        denialCode: 'CO-16',
      }
    }

    if (!isValidNPI(claim.providerNpi)) {
      return {
        status: 'FAIL',
        message: `Invalid NPI: ${claim.providerNpi} does not pass Luhn check`,
        suggestion: 'Verify the NPI is correct. Check digit may be wrong.',
        denialCode: 'CO-16',
      }
    }

    return {
      status: 'PASS',
      message: `NPI ${claim.providerNpi} validated successfully`,
    }
  },
}
