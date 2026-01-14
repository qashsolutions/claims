import { handle } from 'hono/vercel'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { trpcServer } from '@hono/trpc-server'

// Import from compiled workspace packages
import { appRouter } from '../apps/api/dist/trpc/router.js'
import { createContext } from '../apps/api/dist/trpc/context.js'

// Use Edge runtime - required for hono/vercel adapter
export const config = {
  runtime: 'edge',
}

const app = new Hono()

// Request logging middleware
app.use('*', async (c, next) => {
  const startTime = Date.now()
  console.log('[API] Request:', c.req.method, c.req.path)

  try {
    await next()
    const duration = Date.now() - startTime
    console.log('[API] Response:', c.res.status, `${duration}ms`)
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[API] Error:', error, `${duration}ms`)
    throw error
  }
})

// CORS
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

// Security headers
app.use('*', secureHeaders())

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// tRPC - handles /api/trpc/*
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => {
      console.log('[API] tRPC:', c.req.method, c.req.path)
      return createContext({ c, user: null })
    },
  })
)

// Catch-all for other API routes
app.all('/api/*', (c) => {
  return c.json({
    message: 'API is running',
    path: c.req.path,
    method: c.req.method,
  })
})

export default handle(app)
