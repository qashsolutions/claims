import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { trpcServer } from '@hono/trpc-server'

// Import from compiled workspace packages
import { appRouter } from '../apps/api/dist/trpc/router.js'
import { createContext } from '../apps/api/dist/trpc/context.js'

export const config = {
  runtime: 'nodejs',
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

// Convert Node.js request to Web Standard Request for Hono
function nodeToWebRequest(req: VercelRequest): Request {
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost'
  const url = `${protocol}://${host}${req.url}`

  // Convert Node.js headers to Headers object
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v))
      } else {
        headers.set(key, value)
      }
    }
  }

  // Create Web Standard Request
  const init: RequestInit = {
    method: req.method,
    headers,
  }

  // Add body for non-GET/HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    init.body = JSON.stringify(req.body)
  }

  return new Request(url, init)
}

// Export handler for Vercel Node.js runtime
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Convert Node.js request to Web Standard Request
    const webRequest = nodeToWebRequest(req)

    // Call Hono app
    const response = await app.fetch(webRequest)

    // Convert Web Standard Response to Node.js response
    res.status(response.status)

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    // Send body
    const body = await response.text()
    res.send(body)
  } catch (error) {
    console.error('[API] Handler error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
