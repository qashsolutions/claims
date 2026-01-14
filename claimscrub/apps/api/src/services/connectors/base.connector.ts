/**
 * Base Connector Abstract Class
 *
 * Defines the interface and common functionality for all
 * Denali Health data connectors.
 *
 * CONNECTOR PATTERN:
 * All connectors implement a consistent interface for:
 * - Searching external health data sources
 * - Caching results for performance
 * - Handling errors gracefully
 * - Providing typed responses
 *
 * IMPLEMENTED CONNECTORS:
 * - ICD-10 Connector: CMS ICD-10 code lookup and search
 * - CMS Connector: LCD/NCD coverage determination
 * - NPI Connector: NPI registry lookup and validation
 * - PubMed Connector: Clinical evidence search (for appeals)
 */

export interface ConnectorConfig {
  baseUrl: string
  apiKey?: string
  timeout?: number
  cacheEnabled?: boolean
  cacheTtl?: number
}

export interface SearchResult<T> {
  data: T[]
  total: number
  offset: number
  limit: number
  cached?: boolean
}

export abstract class BaseConnector<TSearchResult, TLookupResult> {
  protected config: ConnectorConfig
  protected cache: Map<string, { data: unknown; expiry: number }> = new Map()

  constructor(config: ConnectorConfig) {
    this.config = {
      timeout: 10000,
      cacheEnabled: true,
      cacheTtl: 3600000, // 1 hour default
      ...config,
    }
  }

  /**
   * Search for items matching the query.
   *
   * @param query - Search query string
   * @param options - Search options (offset, limit, filters)
   * @returns Search results with pagination
   */
  abstract search(
    query: string,
    options?: {
      offset?: number
      limit?: number
      filters?: Record<string, unknown>
    }
  ): Promise<SearchResult<TSearchResult>>

  /**
   * Look up a specific item by its unique identifier.
   *
   * @param id - Unique identifier (e.g., ICD code, NPI number)
   * @returns Lookup result or null if not found
   */
  abstract lookup(id: string): Promise<TLookupResult | null>

  /**
   * Validate an identifier format without looking it up.
   *
   * @param id - Identifier to validate
   * @returns true if format is valid
   */
  abstract validate(id: string): boolean

  /**
   * Gets a cached value if available and not expired.
   *
   * @param key - Cache key
   * @returns Cached value or undefined
   */
  protected getCached<T>(key: string): T | undefined {
    if (!this.config.cacheEnabled) return undefined

    const entry = this.cache.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return undefined
    }

    return entry.data as T
  }

  /**
   * Sets a value in the cache.
   *
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Custom TTL in milliseconds (optional)
   */
  protected setCache<T>(key: string, data: T, ttl?: number): void {
    if (!this.config.cacheEnabled) return

    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttl || this.config.cacheTtl!),
    })
  }

  /**
   * Clears the cache.
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Makes an HTTP request with timeout and error handling.
   *
   * @param url - Request URL
   * @param options - Fetch options
   * @returns Response data
   */
  protected async fetchWithTimeout<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
      }

      return response.json() as Promise<T>
    } finally {
      clearTimeout(timeout)
    }
  }
}
