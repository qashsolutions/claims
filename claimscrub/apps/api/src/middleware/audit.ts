import { createMiddleware } from 'hono/factory'
import { logger } from '../utils/logger.js'

export const auditMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now()
  const requestId = crypto.randomUUID()

  // Add request ID to context
  c.set('requestId', requestId)

  // Log request
  logger.info({
    type: 'request',
    requestId,
    method: c.req.method,
    path: c.req.path,
    ip: c.req.header('x-forwarded-for') || 'unknown',
    userAgent: c.req.header('user-agent'),
  })

  await next()

  // Log response
  const duration = Date.now() - start
  logger.info({
    type: 'response',
    requestId,
    status: c.res.status,
    duration,
  })
})
