import { BaseConnector, type SearchResult, type ConnectorConfig } from './base.connector'

/**
 * NPI Registry Connector
 *
 * Provides access to the NPPES (National Plan and Provider Enumeration System)
 * NPI Registry for provider validation and lookup.
 *
 * DATA SOURCE:
 * - NPPES NPI Registry API: https://npiregistry.cms.hhs.gov/api/
 * - Data updated weekly
 *
 * FEATURES:
 * - NPI validation (Luhn algorithm)
 * - Provider search by name, NPI, specialty
 * - Provider details including addresses and specialties
 * - Practice/organization lookup
 */

export type ProviderType = 'individual' | 'organization'

export interface NpiSearchResult {
  npi: string
  providerType: ProviderType
  name: string
  firstName?: string
  lastName?: string
  organizationName?: string
  taxonomyCode?: string
  specialty?: string
  primaryPracticeAddress?: Address
  status: 'active' | 'deactivated'
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  fax?: string
}

export interface NpiDetails extends NpiSearchResult {
  enumerationDate: string
  lastUpdateDate: string
  taxonomies: Array<{
    code: string
    description: string
    primary: boolean
    state?: string
    license?: string
  }>
  addresses: Array<{
    type: 'mailing' | 'location'
    address: Address
  }>
  otherNames?: Array<{
    type: string
    name: string
  }>
  identifiers?: Array<{
    identifier: string
    type: string
    state?: string
    issuer?: string
  }>
}

// Sample NPI data for development
const SAMPLE_PROVIDERS: NpiDetails[] = [
  {
    npi: '1234567893',
    providerType: 'individual',
    name: 'Dr. Sarah Chen',
    firstName: 'Sarah',
    lastName: 'Chen',
    taxonomyCode: '207RH0003X',
    specialty: 'Hematology & Oncology',
    status: 'active',
    enumerationDate: '2015-03-15',
    lastUpdateDate: '2024-06-01',
    primaryPracticeAddress: {
      line1: '123 Medical Center Dr',
      city: 'Boston',
      state: 'MA',
      postalCode: '02115',
      country: 'US',
      phone: '617-555-0100',
    },
    taxonomies: [
      {
        code: '207RH0003X',
        description: 'Hematology & Oncology',
        primary: true,
        state: 'MA',
        license: 'MA12345',
      },
    ],
    addresses: [
      {
        type: 'location',
        address: {
          line1: '123 Medical Center Dr',
          city: 'Boston',
          state: 'MA',
          postalCode: '02115',
          country: 'US',
        },
      },
    ],
  },
  {
    npi: '1987654321',
    providerType: 'organization',
    name: 'Memorial Health Oncology',
    organizationName: 'Memorial Health Oncology',
    taxonomyCode: '282N00000X',
    specialty: 'General Acute Care Hospital',
    status: 'active',
    enumerationDate: '2010-01-01',
    lastUpdateDate: '2024-01-15',
    primaryPracticeAddress: {
      line1: '500 Healthcare Blvd',
      city: 'Boston',
      state: 'MA',
      postalCode: '02116',
      country: 'US',
      phone: '617-555-5000',
    },
    taxonomies: [
      {
        code: '282N00000X',
        description: 'General Acute Care Hospital',
        primary: true,
      },
    ],
    addresses: [
      {
        type: 'location',
        address: {
          line1: '500 Healthcare Blvd',
          city: 'Boston',
          state: 'MA',
          postalCode: '02116',
          country: 'US',
        },
      },
    ],
  },
]

export class NpiConnector extends BaseConnector<NpiSearchResult, NpiDetails> {
  constructor(config?: Partial<ConnectorConfig>) {
    super({
      baseUrl: 'https://npiregistry.cms.hhs.gov/api',
      ...config,
    })
  }

  /**
   * Validates NPI using the Luhn algorithm.
   *
   * NPI validation rules:
   * 1. Must be exactly 10 digits
   * 2. Must pass Luhn check with "80840" prefix (Health Industry Number)
   *
   * @param npi - NPI number to validate
   * @returns true if NPI format is valid
   */
  validate(npi: string): boolean {
    // Must be exactly 10 digits
    if (!/^\d{10}$/.test(npi)) return false

    // Luhn algorithm with 80840 prefix
    const fullNumber = '80840' + npi
    let sum = 0
    let alternate = false

    for (let i = fullNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(fullNumber[i], 10)

      if (alternate) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      alternate = !alternate
    }

    return sum % 10 === 0
  }

  /**
   * Searches for providers by name, NPI, or other criteria.
   *
   * @param query - Search term
   * @param options - Search options including filters
   * @returns Matching providers
   */
  async search(
    query: string,
    options?: {
      offset?: number
      limit?: number
      filters?: {
        providerType?: ProviderType
        state?: string
        specialty?: string
      }
    }
  ): Promise<SearchResult<NpiSearchResult>> {
    const { offset = 0, limit = 20, filters } = options || {}
    const cacheKey = `search:${query}:${offset}:${limit}:${JSON.stringify(filters)}`

    const cached = this.getCached<SearchResult<NpiSearchResult>>(cacheKey)
    if (cached) return { ...cached, cached: true }

    // In production, this would call NPPES API
    const normalizedQuery = query.toLowerCase()

    const filtered = SAMPLE_PROVIDERS.filter((provider) => {
      // Apply filters
      if (filters?.providerType && provider.providerType !== filters.providerType) {
        return false
      }
      if (filters?.state) {
        const hasState = provider.addresses.some(
          (addr) => addr.address.state === filters.state
        )
        if (!hasState) return false
      }
      if (filters?.specialty) {
        if (!provider.specialty?.toLowerCase().includes(filters.specialty.toLowerCase())) {
          return false
        }
      }

      // Search in various fields
      const matchesNpi = provider.npi.includes(query)
      const matchesName = provider.name.toLowerCase().includes(normalizedQuery)
      const matchesOrg = provider.organizationName?.toLowerCase().includes(normalizedQuery)
      const matchesSpecialty = provider.specialty?.toLowerCase().includes(normalizedQuery)

      return matchesNpi || matchesName || matchesOrg || matchesSpecialty
    })

    const result: SearchResult<NpiSearchResult> = {
      data: filtered.slice(offset, offset + limit).map((p) => ({
        npi: p.npi,
        providerType: p.providerType,
        name: p.name,
        firstName: p.firstName,
        lastName: p.lastName,
        organizationName: p.organizationName,
        taxonomyCode: p.taxonomyCode,
        specialty: p.specialty,
        primaryPracticeAddress: p.primaryPracticeAddress,
        status: p.status,
      })),
      total: filtered.length,
      offset,
      limit,
    }

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Looks up a specific NPI.
   *
   * @param npi - NPI number
   * @returns Provider details or null if not found
   */
  async lookup(npi: string): Promise<NpiDetails | null> {
    // First validate format
    if (!this.validate(npi)) {
      return null
    }

    const cacheKey = `lookup:${npi}`

    const cached = this.getCached<NpiDetails>(cacheKey)
    if (cached) return cached

    // In production, this would call NPPES API
    const found = SAMPLE_PROVIDERS.find((p) => p.npi === npi)

    if (found) {
      this.setCache(cacheKey, found)
    }

    return found || null
  }

  /**
   * Verifies an NPI and returns basic status.
   *
   * Combines format validation with registry lookup.
   *
   * @param npi - NPI to verify
   * @returns Verification result
   */
  async verify(npi: string): Promise<{
    valid: boolean
    found: boolean
    active: boolean
    name?: string
    specialty?: string
    errorMessage?: string
  }> {
    // Check format
    if (!this.validate(npi)) {
      return {
        valid: false,
        found: false,
        active: false,
        errorMessage: 'Invalid NPI format - must be 10 digits with valid check digit',
      }
    }

    // Look up in registry
    const details = await this.lookup(npi)

    if (!details) {
      return {
        valid: true,
        found: false,
        active: false,
        errorMessage: 'NPI not found in NPPES registry',
      }
    }

    if (details.status !== 'active') {
      return {
        valid: true,
        found: true,
        active: false,
        name: details.name,
        specialty: details.specialty,
        errorMessage: 'NPI is deactivated',
      }
    }

    return {
      valid: true,
      found: true,
      active: true,
      name: details.name,
      specialty: details.specialty,
    }
  }
}

export const npiConnector = new NpiConnector()
