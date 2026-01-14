/**
 * Health Data Connectors
 *
 * Unified access to external healthcare data sources for
 * claims validation and processing.
 *
 * CONNECTORS:
 * - ICD-10: CMS diagnosis code lookup and search
 * - CMS: Coverage determination (NCD/LCD) lookup
 * - NPI: Provider registry validation and lookup
 *
 * USAGE:
 * ```typescript
 * import { icd10Connector, cmsConnector, npiConnector } from './connectors'
 *
 * // Search ICD-10 codes
 * const icdCodes = await icd10Connector.search('breast cancer')
 *
 * // Check coverage
 * const coverage = await cmsConnector.lookup('96413')
 *
 * // Verify NPI
 * const npiResult = await npiConnector.verify('1234567893')
 * ```
 */

export { BaseConnector, type ConnectorConfig, type SearchResult } from './base.connector.js'
export { Icd10Connector, icd10Connector, type IcdCode, type IcdLookupResult } from './icd10.connector.js'
export { CmsConnector, cmsConnector, type CoverageDocument, type CoverageDetermination, type CoverageStatus } from './cms.connector.js'
export { NpiConnector, npiConnector, type NpiSearchResult, type NpiDetails, type ProviderType, type Address } from './npi.connector.js'
