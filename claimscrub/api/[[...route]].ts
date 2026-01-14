import { handle } from 'hono/vercel'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { trpcServer } from '@hono/trpc-server'

// Import from workspace packages
import { appRouter } from '@claimscrub/api/trpc'
import { createContext } from '@claimscrub/api/trpc/context'

export const config = {
  runtime: 'nodejs',
}

console.log('[Vercel API] Initializing serverless function')

const app = new Hono().basePath('/api')

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
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// tRPC
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => {
      console.log('[Vercel API] Creating context for tRPC request:', c.req.path)
      return createContext({ c, user: null })
    },
  })
)

// Catch-all for other API routes
app.all('/*', (c) => {
  console.log('[Vercel API] Catch-all route hit:', c.req.path)
  return c.json({
    message: 'API is running',
    path: c.req.path,
    method: c.req.method,
  })
})

export default handle(app)
