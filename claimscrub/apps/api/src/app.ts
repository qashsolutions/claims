import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './trpc/router.js'
import { createContext } from './trpc/context.js'
import { rateLimitMiddleware } from './middleware/rateLimit.js'
import { auditMiddleware } from './middleware/audit.js'
import { errorMiddleware } from './middleware/error.js'
import { env } from './config/env.js'
import { stripeWebhook } from './routes/webhooks/stripe.js'

export const app = new Hono()

// CORS
app.use(
  '*',
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
)

// Security headers
app.use('*', secureHeaders())

// Rate limiting
app.use('*', rateLimitMiddleware)

// Audit logging
app.use('*', auditMiddleware)

// Error handling
app.use('*', errorMiddleware)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Stripe webhook (before tRPC, needs raw body)
app.route('/api/webhooks/stripe', stripeWebhook)

// tRPC
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => createContext({ c, user: null }),
  })
)

export type AppRouter = typeof appRouter
