import { router } from './index.js'
import { claimsRouter } from './procedures/claims.js'
import { epicRouter } from './procedures/epic.js'
import { validationRouter } from './procedures/validation.js'
import { askDenaliRouter } from './procedures/askDenali.js'

export const appRouter = router({
  claims: claimsRouter,
  epic: epicRouter,
  validation: validationRouter,
  askDenali: askDenaliRouter,
})

export type AppRouter = typeof appRouter
