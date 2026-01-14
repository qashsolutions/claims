import { BaseConnector, type SearchResult, type ConnectorConfig } from './base.connector.js'

/**
 * CMS Coverage Connector
 *
 * Provides access to CMS Medicare coverage information:
 * - National Coverage Determinations (NCDs)
 * - Local Coverage Determinations (LCDs)
 * - Local Coverage Articles (LCAs)
 * - Medicare Administrative Contractor (MAC) information
 *
 * DATA SOURCES:
 * - Medicare Coverage Database (MCD): https://www.cms.gov/medicare-coverage-database
 * - Coverage documents are updated quarterly
 *
 * FEATURES:
 * - Search NCDs/LCDs by CPT code
 * - Determine coverage status for procedures
 * - Retrieve documentation requirements
 * - Identify MAC-specific requirements
 */

export type CoverageStatus = 'covered' | 'non-covered' | 'conditional' | 'unknown'

export interface CoverageDocument {
  id: string
  type: 'NCD' | 'LCD' | 'LCA'
  title: string
  effectiveDate: string
  endDate?: string
  contractor?: string
  contractorType?: string
  summary: string
  coverageIndications?: string[]
  limitations?: string[]
  documentationRequirements?: string[]
  icdCodes?: string[]
  cptCodes?: string[]
}

export interface CoverageDetermination {
  cptCode: string
  status: CoverageStatus
  ncds: CoverageDocument[]
  lcds: CoverageDocument[]
  documentationRequired: string[]
  priorAuthRequired: boolean
  limitations: string[]
}

// Sample coverage data for development
const SAMPLE_NCDS: CoverageDocument[] = [
  {
    id: 'NCD-110.17',
    type: 'NCD',
    title: 'Anti-Cancer Chemotherapy for Colorectal Cancer',
    effectiveDate: '2023-01-01',
    summary: 'Medicare covers anti-cancer chemotherapy drugs when used for FDA-approved indications or off-label use supported by medical compendia.',
    coverageIndications: [
      'FDA-approved indications for colorectal cancer',
      'Off-label use listed in NCCN guidelines',
      'Part of clinical trial',
    ],
    limitations: [
      'Must be administered by qualified provider',
      'Documented diagnosis required',
    ],
    documentationRequirements: [
      'Pathology report confirming malignancy',
      'Treatment plan from oncologist',
      'Drug administration record',
    ],
    cptCodes: ['96413', '96415', '96416', '96417'],
  },
  {
    id: 'NCD-160.1',
    type: 'NCD',
    title: 'Inpatient Hospital Stays for Treatment of Alcoholism',
    effectiveDate: '2022-01-01',
    summary: 'Medicare covers inpatient hospital services for treatment of alcoholism under certain conditions.',
    cptCodes: ['90832', '90834', '90837'],
  },
]

const SAMPLE_LCDS: CoverageDocument[] = [
  {
    id: 'LCD-L35396',
    type: 'LCD',
    title: 'Biomarkers for Oncology',
    effectiveDate: '2024-01-01',
    contractor: 'Novitas Solutions',
    contractorType: 'MAC',
    summary: 'Coverage criteria for tumor biomarker testing including PD-L1, MSI, and TMB.',
    coverageIndications: [
      'Testing to guide targeted therapy selection',
      'Required for pembrolizumab eligibility',
    ],
    documentationRequirements: [
      'Tumor type documentation',
      'Prior therapy history',
      'Ordering provider credentials',
    ],
    cptCodes: ['81445', '81455', '88360', '88361'],
    icdCodes: ['C50', 'C34', 'C18'],
  },
  {
    id: 'LCD-L33562',
    type: 'LCD',
    title: 'Continuous Glucose Monitors',
    effectiveDate: '2023-07-01',
    contractor: 'CGS Administrators',
    contractorType: 'DME MAC',
    summary: 'Coverage criteria for continuous glucose monitoring systems in diabetic patients.',
    coverageIndications: [
      'Type 1 diabetes with multiple daily insulin injections',
      'Type 2 diabetes with intensive insulin therapy',
      'History of hypoglycemia unawareness',
    ],
    limitations: [
      'Must perform 4+ finger sticks daily',
      'Quarterly face-to-face visits required',
    ],
    cptCodes: ['95250', '95251'],
    icdCodes: ['E10', 'E11', 'E13'],
  },
]

export class CmsConnector extends BaseConnector<CoverageDocument, CoverageDetermination> {
  constructor(config?: Partial<ConnectorConfig>) {
    super({
      baseUrl: 'https://www.cms.gov/medicare-coverage-database/api',
      ...config,
    })
  }

  /**
   * Validates document ID format.
   */
  validate(id: string): boolean {
    // NCD format: NCD-XXX.X or NCD XXX.X
    // LCD format: LCD-LXXXXX or L-XXXXX
    const ncdPattern = /^NCD[- ]?\d+(\.\d+)?$/i
    const lcdPattern = /^(LCD[- ]?)?L\d{5}$/i

    return ncdPattern.test(id) || lcdPattern.test(id)
  }

  /**
   * Searches coverage documents.
   *
   * @param query - Search term (CPT code, diagnosis, or keyword)
   * @param options - Search options
   * @returns Matching coverage documents
   */
  async search(
    query: string,
    options?: {
      offset?: number
      limit?: number
      filters?: { type?: 'NCD' | 'LCD' | 'LCA'; contractor?: string }
    }
  ): Promise<SearchResult<CoverageDocument>> {
    const { offset = 0, limit = 20, filters } = options || {}
    const cacheKey = `search:${query}:${offset}:${limit}:${JSON.stringify(filters)}`

    const cached = this.getCached<SearchResult<CoverageDocument>>(cacheKey)
    if (cached) return { ...cached, cached: true }

    // In production, this would call CMS MCD API
    const allDocs = [...SAMPLE_NCDS, ...SAMPLE_LCDS]
    const normalizedQuery = query.toLowerCase()

    const filtered = allDocs.filter((doc) => {
      // Filter by type if specified
      if (filters?.type && doc.type !== filters.type) return false
      if (filters?.contractor && doc.contractor !== filters.contractor) return false

      // Search in various fields
      const matchesTitle = doc.title.toLowerCase().includes(normalizedQuery)
      const matchesSummary = doc.summary.toLowerCase().includes(normalizedQuery)
      const matchesCpt = doc.cptCodes?.some((code) =>
        code.toLowerCase().includes(normalizedQuery)
      )
      const matchesIcd = doc.icdCodes?.some((code) =>
        code.toLowerCase().includes(normalizedQuery)
      )

      return matchesTitle || matchesSummary || matchesCpt || matchesIcd
    })

    const result: SearchResult<CoverageDocument> = {
      data: filtered.slice(offset, offset + limit),
      total: filtered.length,
      offset,
      limit,
    }

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Looks up coverage determination for a specific code.
   *
   * @param cptCode - CPT code to check coverage for
   * @returns Coverage determination with applicable NCDs/LCDs
   */
  async lookup(cptCode: string): Promise<CoverageDetermination | null> {
    const cacheKey = `lookup:${cptCode}`

    const cached = this.getCached<CoverageDetermination>(cacheKey)
    if (cached) return cached

    // Find applicable NCDs
    const ncds = SAMPLE_NCDS.filter((doc) =>
      doc.cptCodes?.includes(cptCode)
    )

    // Find applicable LCDs
    const lcds = SAMPLE_LCDS.filter((doc) =>
      doc.cptCodes?.includes(cptCode)
    )

    // Aggregate documentation requirements
    const docReqs = new Set<string>()
    const limitations: string[] = []

    for (const doc of [...ncds, ...lcds]) {
      doc.documentationRequirements?.forEach((req) => docReqs.add(req))
      doc.limitations?.forEach((lim) => limitations.push(lim))
    }

    // Determine coverage status
    let status: CoverageStatus = 'unknown'
    if (ncds.length > 0 || lcds.length > 0) {
      status = limitations.length > 0 ? 'conditional' : 'covered'
    }

    const result: CoverageDetermination = {
      cptCode,
      status,
      ncds,
      lcds,
      documentationRequired: Array.from(docReqs),
      priorAuthRequired: lcds.some((lcd) =>
        lcd.summary.toLowerCase().includes('prior auth')
      ),
      limitations,
    }

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Gets coverage status for a procedure with a specific payer.
   *
   * @param cptCode - CPT code
   * @param icdCodes - Diagnosis codes
   * @param payerType - Payer type (medicare, medicaid, commercial)
   * @returns Coverage status
   */
  async getCoverageStatus(
    cptCode: string,
    icdCodes: string[],
    payerType: 'medicare' | 'medicaid' | 'commercial' = 'medicare'
  ): Promise<{
    covered: boolean
    conditions: string[]
    documentation: string[]
  }> {
    const determination = await this.lookup(cptCode)

    if (!determination || determination.status === 'unknown') {
      return {
        covered: true, // Default to covered if no specific policy
        conditions: [],
        documentation: [],
      }
    }

    return {
      covered: determination.status !== 'non-covered',
      conditions: determination.limitations,
      documentation: determination.documentationRequired,
    }
  }
}

export const cmsConnector = new CmsConnector()
