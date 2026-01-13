import { BaseConnector, type SearchResult, type ConnectorConfig } from './base.connector'

/**
 * ICD-10 Connector
 *
 * Provides access to ICD-10-CM diagnosis code data from CMS.
 * Supports code lookup, search, and hierarchical navigation.
 *
 * DATA SOURCE:
 * - CMS ICD-10-CM Code Tables (updated annually)
 * - https://www.cms.gov/medicare/icd-10/icd-10-cm-hcd-drg-tables
 *
 * FEATURES:
 * - Full-text search across code and description
 * - Hierarchical code navigation (chapters, sections, categories)
 * - Code validity checking (billable vs. header codes)
 * - Related code suggestions
 */

export interface IcdCode {
  code: string
  description: string
  shortDescription: string
  isBillable: boolean
  chapter: string
  chapterDescription: string
  category: string
  categoryDescription: string
  effectiveDate?: string
  terminationDate?: string
}

export interface IcdLookupResult extends IcdCode {
  parentCode?: string
  childCodes?: string[]
  includes?: string[]
  excludes1?: string[]
  excludes2?: string[]
  codeFirst?: string[]
  useAdditional?: string[]
}

// Sample ICD-10 data for development
// In production, this would come from CMS API or database
const ICD10_SAMPLE_DATA: IcdCode[] = [
  // Oncology codes
  {
    code: 'C50.911',
    description: 'Malignant neoplasm of unspecified site of right female breast',
    shortDescription: 'Mal neo right female breast',
    isBillable: true,
    chapter: 'C00-D49',
    chapterDescription: 'Neoplasms',
    category: 'C50',
    categoryDescription: 'Malignant neoplasm of breast',
  },
  {
    code: 'C50.912',
    description: 'Malignant neoplasm of unspecified site of left female breast',
    shortDescription: 'Mal neo left female breast',
    isBillable: true,
    chapter: 'C00-D49',
    chapterDescription: 'Neoplasms',
    category: 'C50',
    categoryDescription: 'Malignant neoplasm of breast',
  },
  {
    code: 'C34.90',
    description: 'Malignant neoplasm of unspecified part of unspecified bronchus or lung',
    shortDescription: 'Mal neo bronchus or lung',
    isBillable: true,
    chapter: 'C00-D49',
    chapterDescription: 'Neoplasms',
    category: 'C34',
    categoryDescription: 'Malignant neoplasm of bronchus and lung',
  },

  // Mental health codes
  {
    code: 'F33.1',
    description: 'Major depressive disorder, recurrent, moderate',
    shortDescription: 'MDD recurrent moderate',
    isBillable: true,
    chapter: 'F01-F99',
    chapterDescription: 'Mental, Behavioral and Neurodevelopmental disorders',
    category: 'F33',
    categoryDescription: 'Major depressive disorder, recurrent',
  },
  {
    code: 'F41.1',
    description: 'Generalized anxiety disorder',
    shortDescription: 'GAD',
    isBillable: true,
    chapter: 'F01-F99',
    chapterDescription: 'Mental, Behavioral and Neurodevelopmental disorders',
    category: 'F41',
    categoryDescription: 'Other anxiety disorders',
  },

  // Endocrinology codes
  {
    code: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    shortDescription: 'Type 2 DM w/o complications',
    isBillable: true,
    chapter: 'E00-E89',
    chapterDescription: 'Endocrine, nutritional and metabolic diseases',
    category: 'E11',
    categoryDescription: 'Type 2 diabetes mellitus',
  },
  {
    code: 'E11.65',
    description: 'Type 2 diabetes mellitus with hyperglycemia',
    shortDescription: 'Type 2 DM w/ hyperglycemia',
    isBillable: true,
    chapter: 'E00-E89',
    chapterDescription: 'Endocrine, nutritional and metabolic diseases',
    category: 'E11',
    categoryDescription: 'Type 2 diabetes mellitus',
  },

  // OB/GYN codes
  {
    code: 'O80',
    description: 'Encounter for full-term uncomplicated delivery',
    shortDescription: 'Full-term delivery',
    isBillable: true,
    chapter: 'O00-O9A',
    chapterDescription: 'Pregnancy, childbirth and the puerperium',
    category: 'O80',
    categoryDescription: 'Encounter for full-term uncomplicated delivery',
  },
  {
    code: 'Z34.00',
    description: 'Encounter for supervision of normal first pregnancy, unspecified trimester',
    shortDescription: 'Supervision normal pregnancy',
    isBillable: true,
    chapter: 'Z00-Z99',
    chapterDescription: 'Factors influencing health status',
    category: 'Z34',
    categoryDescription: 'Encounter for supervision of normal pregnancy',
  },
]

export class Icd10Connector extends BaseConnector<IcdCode, IcdLookupResult> {
  constructor(config?: Partial<ConnectorConfig>) {
    super({
      baseUrl: 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3',
      ...config,
    })
  }

  /**
   * Validates ICD-10-CM code format.
   *
   * ICD-10-CM codes follow the pattern:
   * - 3-7 characters
   * - First character is alpha (A-Z)
   * - Second and third characters are numeric
   * - Optional decimal point after third character
   * - Remaining characters are alphanumeric
   */
  validate(code: string): boolean {
    // Remove decimal for validation
    const normalized = code.replace('.', '').toUpperCase()

    // Must be 3-7 characters
    if (normalized.length < 3 || normalized.length > 7) return false

    // First char must be alpha
    if (!/^[A-Z]/.test(normalized)) return false

    // Second and third must be numeric
    if (!/^\d{2}/.test(normalized.slice(1, 3))) return false

    // Remaining must be alphanumeric
    if (normalized.length > 3 && !/^[A-Z0-9]+$/.test(normalized.slice(3))) return false

    return true
  }

  /**
   * Searches for ICD-10 codes matching the query.
   *
   * Searches both code and description fields.
   *
   * @param query - Search term
   * @param options - Search options
   * @returns Matching ICD codes
   */
  async search(
    query: string,
    options?: { offset?: number; limit?: number; filters?: Record<string, unknown> }
  ): Promise<SearchResult<IcdCode>> {
    const { offset = 0, limit = 20, filters } = options || {}
    const cacheKey = `search:${query}:${offset}:${limit}:${JSON.stringify(filters)}`

    // Check cache
    const cached = this.getCached<SearchResult<IcdCode>>(cacheKey)
    if (cached) {
      return { ...cached, cached: true }
    }

    // In production, this would call the NLM Clinical Tables API
    // For development, search sample data
    const normalizedQuery = query.toLowerCase()
    const filtered = ICD10_SAMPLE_DATA.filter((code) => {
      const matchesCode = code.code.toLowerCase().includes(normalizedQuery)
      const matchesDescription = code.description.toLowerCase().includes(normalizedQuery)
      const matchesShort = code.shortDescription.toLowerCase().includes(normalizedQuery)

      return matchesCode || matchesDescription || matchesShort
    })

    const result: SearchResult<IcdCode> = {
      data: filtered.slice(offset, offset + limit),
      total: filtered.length,
      offset,
      limit,
    }

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Looks up a specific ICD-10 code.
   *
   * @param code - ICD-10-CM code
   * @returns Code details or null if not found
   */
  async lookup(code: string): Promise<IcdLookupResult | null> {
    const normalized = code.toUpperCase().replace('.', '')
    const cacheKey = `lookup:${normalized}`

    // Check cache
    const cached = this.getCached<IcdLookupResult>(cacheKey)
    if (cached) return cached

    // In production, this would call CMS API
    // For development, search sample data
    const found = ICD10_SAMPLE_DATA.find(
      (c) => c.code.replace('.', '') === normalized
    )

    if (!found) return null

    const result: IcdLookupResult = {
      ...found,
      // Additional details would come from API
      includes: [],
      excludes1: [],
      excludes2: [],
    }

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Gets suggested ICD codes for a given CPT procedure.
   *
   * Uses medical necessity mappings to suggest appropriate
   * diagnosis codes that support the procedure.
   *
   * @param cptCode - CPT procedure code
   * @returns Suggested ICD codes
   */
  async getSuggestionsForCpt(cptCode: string): Promise<IcdCode[]> {
    // CPT to ICD mapping for common procedures
    const cptIcdMap: Record<string, string[]> = {
      '96413': ['C50.911', 'C50.912', 'C34.90'], // Chemotherapy
      '96415': ['C50.911', 'C50.912', 'C34.90'], // Chemotherapy
      '90837': ['F33.1', 'F41.1'], // Psychotherapy
      '90834': ['F33.1', 'F41.1'], // Psychotherapy
      '95250': ['E11.9', 'E11.65'], // CGM
      '59400': ['O80', 'Z34.00'], // OB care
    }

    const suggestedCodes = cptIcdMap[cptCode] || []

    return ICD10_SAMPLE_DATA.filter((code) =>
      suggestedCodes.includes(code.code)
    )
  }
}

export const icd10Connector = new Icd10Connector()
