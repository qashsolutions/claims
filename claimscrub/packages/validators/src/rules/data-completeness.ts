import type { ValidationRule } from '../engine/rule-engine'

interface MissingField {
  field: string
  label: string
}

export const dataCompletenessRule: ValidationRule = {
  id: 'data-completeness',
  name: 'Data Completeness Check',
  checkType: 'DATA_COMPLETENESS',
  description: 'Validates all required claim fields are present',

  validate: ({ claim }) => {
    const missingFields: MissingField[] = []

    // Patient fields
    if (!claim.patientName) missingFields.push({ field: 'patientName', label: 'Patient Name' })
    if (!claim.patientDob) missingFields.push({ field: 'patientDob', label: 'Patient DOB' })
    if (!claim.patientGender) missingFields.push({ field: 'patientGender', label: 'Patient Gender' })
    if (!claim.insuranceId) missingFields.push({ field: 'insuranceId', label: 'Insurance ID' })
    if (!claim.payerName) missingFields.push({ field: 'payerName', label: 'Payer Name' })

    // Provider fields
    if (!claim.providerNpi) missingFields.push({ field: 'providerNpi', label: 'Provider NPI' })
    if (!claim.providerName) missingFields.push({ field: 'providerName', label: 'Provider Name' })

    // Service fields
    if (!claim.dateOfService) missingFields.push({ field: 'dateOfService', label: 'Date of Service' })
    if (!claim.placeOfService) missingFields.push({ field: 'placeOfService', label: 'Place of Service' })

    // Service lines
    if (!claim.serviceLines || claim.serviceLines.length === 0) {
      missingFields.push({ field: 'serviceLines', label: 'Service Lines' })
    } else {
      for (const line of claim.serviceLines) {
        if (!line.cptCode) {
          missingFields.push({ field: `serviceLine[${line.lineNumber}].cptCode`, label: `Line ${line.lineNumber} CPT Code` })
        }
        if (!line.icdCodes || line.icdCodes.length === 0) {
          missingFields.push({ field: `serviceLine[${line.lineNumber}].icdCodes`, label: `Line ${line.lineNumber} Diagnosis Codes` })
        }
        if (line.charge === undefined || line.charge <= 0) {
          missingFields.push({ field: `serviceLine[${line.lineNumber}].charge`, label: `Line ${line.lineNumber} Charge` })
        }
      }
    }

    if (missingFields.length > 0) {
      const critical = missingFields.filter((f) =>
        ['patientName', 'providerNpi', 'dateOfService', 'insuranceId'].some((c) => f.field.includes(c))
      )

      if (critical.length > 0) {
        return {
          status: 'FAIL',
          message: `Missing required fields: ${critical.map((f) => f.label).join(', ')}`,
          suggestion: 'Complete all required fields before submission',
          denialCode: 'CO-16',
          metadata: { missingFields },
        }
      }

      return {
        status: 'WARN',
        message: `Some optional fields are missing: ${missingFields.map((f) => f.label).join(', ')}`,
        suggestion: 'Consider completing these fields for faster processing',
        metadata: { missingFields },
      }
    }

    return {
      status: 'PASS',
      message: 'All required fields are complete',
    }
  },
}
