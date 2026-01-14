import { handle } from 'hono/vercel'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

export const config = {
  runtime: 'nodejs',
}

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

// Placeholder for tRPC and other routes
// These will be imported from apps/api once we resolve the build
app.all('/*', (c) => {
  return c.json({
    message: 'API is running',
    path: c.req.path,
    method: c.req.method
  })
})

export default handle(app)
