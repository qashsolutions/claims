import { createMiddleware } from 'hono/factory'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '../config/env.js'

let ratelimit: Ratelimit | null = null

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  })
}

export const rateLimitMiddleware = createMiddleware(async (c, next) => {
  if (!ratelimit) {
    await next()
    return
  }

  const ip = c.req.header('x-forwarded-for') || 'unknown'
  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  c.header('X-RateLimit-Limit', limit.toString())
  c.header('X-RateLimit-Remaining', remaining.toString())
  c.header('X-RateLimit-Reset', reset.toString())

  if (!success) {
    return c.json({ error: 'Too many requests' }, 429)
  }

  await next()
})
