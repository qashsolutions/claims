import { z } from 'zod'
import { router, publicProcedure } from '../index.js'
import { prisma } from '../../db/index.js'

export const auditRouter = router({
  /**
   * Log an audit event (login/logout)
   * Public procedure since it's called during auth flow
   */
  logEvent: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        action: z.enum(['LOGIN', 'LOGOUT']),
        metadata: z.record(z.unknown()).optional(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, action, metadata, ipAddress, userAgent } = input

      try {
        // Verify user exists in our User table
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          // User doesn't exist in our system yet, skip audit logging
          console.warn(`[Audit] User ${userId} not found, skipping ${action} log`)
          return { success: false, reason: 'user_not_found' }
        }

        // Create audit log entry
        const auditLog = await prisma.auditLog.create({
          data: {
            userId,
            action,
            resource: 'session',
            resourceId: `sess_${Date.now()}`,
            metadata: metadata ?? {},
            ipAddress: ipAddress ?? 'unknown',
            userAgent: userAgent ?? null,
          },
        })

        return { success: true, id: auditLog.id }
      } catch (error) {
        console.error(`[Audit] Failed to log ${action} event for user ${userId}:`, error)
        return { success: false, reason: 'internal_error' }
      }
    }),
})
