// Debug: Log at the very start before any imports
console.log('='.repeat(60))
console.log('[Vercel API] ===== MODULE INITIALIZATION START =====')
console.log('[Vercel API] Timestamp:', new Date().toISOString())
console.log('[Vercel API] NODE_ENV:', process.env.NODE_ENV)
console.log('[Vercel API] Current directory:', process.cwd())

// Check what files exist
import { existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('[Vercel API] __dirname:', __dirname)
console.log('[Vercel API] __filename:', __filename)

// Check root directory
const rootDir = resolve(__dirname, '..')
console.log('[Vercel API] Root dir:', rootDir)
try {
  const rootContents = readdirSync(rootDir)
  console.log('[Vercel API] Root contents:', rootContents.slice(0, 20))
} catch (e) {
  console.log('[Vercel API] Error reading root dir:', e)
}

// Check apps directory
const appsDir = resolve(__dirname, '../apps')
console.log('[Vercel API] Apps dir exists:', existsSync(appsDir))
if (existsSync(appsDir)) {
  try {
    console.log('[Vercel API] Apps contents:', readdirSync(appsDir))
  } catch (e) {
    console.log('[Vercel API] Error reading apps dir:', e)
  }
}

// Check apps/api/dist directory
const apiDistDir = resolve(__dirname, '../apps/api/dist')
console.log('[Vercel API] API dist dir exists:', existsSync(apiDistDir))
if (existsSync(apiDistDir)) {
  try {
    console.log('[Vercel API] API dist contents:', readdirSync(apiDistDir))
  } catch (e) {
    console.log('[Vercel API] Error reading api dist:', e)
  }
}

// Check apps/api/dist/trpc directory
const trpcDistDir = resolve(__dirname, '../apps/api/dist/trpc')
console.log('[Vercel API] tRPC dist dir exists:', existsSync(trpcDistDir))
if (existsSync(trpcDistDir)) {
  try {
    console.log('[Vercel API] tRPC dist contents:', readdirSync(trpcDistDir))
  } catch (e) {
    console.log('[Vercel API] Error reading trpc dist:', e)
  }
}

// Check specific files
const routerPath = resolve(__dirname, '../apps/api/dist/trpc/router.js')
const contextPath = resolve(__dirname, '../apps/api/dist/trpc/context.js')
console.log('[Vercel API] router.js exists:', existsSync(routerPath))
console.log('[Vercel API] context.js exists:', existsSync(contextPath))

// Check node_modules
const nodeModulesDir = resolve(__dirname, '../node_modules')
console.log('[Vercel API] node_modules exists:', existsSync(nodeModulesDir))

// Check for @claimscrub packages in node_modules
const claimScrubDir = resolve(__dirname, '../node_modules/@claimscrub')
console.log('[Vercel API] @claimscrub in node_modules exists:', existsSync(claimScrubDir))
if (existsSync(claimScrubDir)) {
  try {
    console.log('[Vercel API] @claimscrub contents:', readdirSync(claimScrubDir))
  } catch (e) {
    console.log('[Vercel API] Error reading @claimscrub:', e)
  }
}

console.log('[Vercel API] ===== STARTING IMPORTS =====')

import { handle } from 'hono/vercel'
console.log('[Vercel API] ✓ hono/vercel imported')

import { Hono } from 'hono'
console.log('[Vercel API] ✓ hono imported')

import { cors } from 'hono/cors'
console.log('[Vercel API] ✓ hono/cors imported')

import { secureHeaders } from 'hono/secure-headers'
console.log('[Vercel API] ✓ hono/secure-headers imported')

import { trpcServer } from '@hono/trpc-server'
console.log('[Vercel API] ✓ @hono/trpc-server imported')

// Try importing from relative paths
console.log('[Vercel API] Attempting to import appRouter from:', routerPath)
import { appRouter } from '../apps/api/dist/trpc/router.js'
console.log('[Vercel API] ✓ appRouter imported successfully')
console.log('[Vercel API] appRouter type:', typeof appRouter)

console.log('[Vercel API] Attempting to import createContext from:', contextPath)
import { createContext } from '../apps/api/dist/trpc/context.js'
console.log('[Vercel API] ✓ createContext imported successfully')
console.log('[Vercel API] createContext type:', typeof createContext)

console.log('[Vercel API] ===== ALL IMPORTS SUCCESSFUL =====')

export const config = {
  runtime: 'nodejs',
}

console.log('[Vercel API] Creating Hono app...')
// Note: Don't use basePath - Vercel passes the full URL including /api
const app = new Hono()
console.log('[Vercel API] ✓ Hono app created')

// Request logging middleware - runs first on every request
app.use('*', async (c, next) => {
  const startTime = Date.now()
  console.log('='.repeat(40))
  console.log('[Vercel API] >>> REQUEST RECEIVED <<<')
  console.log('[Vercel API] Method:', c.req.method)
  console.log('[Vercel API] URL:', c.req.url)
  console.log('[Vercel API] Path:', c.req.path)
  console.log('[Vercel API] Time:', new Date().toISOString())

  try {
    await next()
    const duration = Date.now() - startTime
    console.log('[Vercel API] >>> RESPONSE SENT <<<')
    console.log('[Vercel API] Status:', c.res.status)
    console.log('[Vercel API] Duration:', duration, 'ms')
    console.log('='.repeat(40))
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[Vercel API] >>> REQUEST ERROR <<<')
    console.error('[Vercel API] Error:', error)
    console.error('[Vercel API] Duration:', duration, 'ms')
    console.log('='.repeat(40))
    throw error
  }
})
console.log('[Vercel API] ✓ Request logging middleware added')

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
console.log('[Vercel API] ✓ CORS middleware added')

// Security headers
app.use('*', secureHeaders())
console.log('[Vercel API] ✓ Security headers middleware added')

// Health check
app.get('/api/health', (c) => {
  console.log('[Vercel API] Health check endpoint hit')
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})
console.log('[Vercel API] ✓ Health check route added')

// tRPC - handles /api/trpc/*
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => {
      console.log('[Vercel API] tRPC request received:', c.req.method, c.req.path)
      return createContext({ c, user: null })
    },
  })
)
console.log('[Vercel API] ✓ tRPC middleware added')

// Catch-all for other API routes
app.all('/api/*', (c) => {
  console.log('[Vercel API] Catch-all route hit:', c.req.method, c.req.path)
  return c.json({
    message: 'API is running',
    path: c.req.path,
    method: c.req.method,
  })
})
console.log('[Vercel API] ✓ Catch-all route added')

console.log('[Vercel API] ===== MODULE INITIALIZATION COMPLETE =====')
console.log('='.repeat(60))

// Export Hono handler directly - don't wrap it, as that breaks request handling
export default handle(app)
