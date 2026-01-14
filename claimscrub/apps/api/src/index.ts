import { serve } from '@hono/node-server'
import { app } from './app.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

// Re-export types for consumers
export type {
  FhirPatient,
  FhirCondition,
  FhirCoverage,
  FhirAuthorization,
} from './services/epic/client.js'
export type { AuthCheckResult } from './services/validation.service.js'

const port = env.PORT

serve({
  fetch: app.fetch,
  port,
})

logger.info(`Server running on http://localhost:${port}`)
