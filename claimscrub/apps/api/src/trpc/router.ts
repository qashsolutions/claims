import { router } from './index.js'
import { claimsRouter } from './procedures/claims.js'
import { epicRouter } from './procedures/epic.js'
import { validationRouter } from './procedures/validation.js'
import { askDenaliRouter } from './procedures/askDenali.js'
import { auditRouter } from './procedures/audit.js'

export const appRouter = router({
  claims: claimsRouter,
  epic: epicRouter,
  validation: validationRouter,
  askDenali: askDenaliRouter,
  audit: auditRouter,
})

export type AppRouter = typeof appRouter
