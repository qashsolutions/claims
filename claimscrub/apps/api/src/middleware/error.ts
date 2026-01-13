import { createMiddleware } from 'hono/factory'
import { logger } from '../utils/logger.js'

export const errorMiddleware = createMiddleware(async (c, next) => {
  try {
    await next()
  } catch (error) {
    const requestId = c.get('requestId') || 'unknown'

    logger.error({
      type: 'error',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return c.json(
      {
        error: 'Internal Server Error',
        requestId,
      },
      500
    )
  }
})
