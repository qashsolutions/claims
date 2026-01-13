import type { Context as HonoContext } from 'hono'
import type { User } from '@prisma/client'
import { prisma } from '../db/index.js'

export interface CreateContextOptions {
  c: HonoContext
  user: User | null
}

export function createContext({ c, user }: CreateContextOptions) {
  return {
    prisma,
    user,
    req: c.req,
    res: c.res,
    ip: c.req.header('x-forwarded-for') || 'unknown',
    userAgent: c.req.header('user-agent') || 'unknown',
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
