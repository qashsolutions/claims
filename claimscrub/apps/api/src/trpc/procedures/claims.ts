import { z } from 'zod'
import { router, protectedProcedure } from '../index.js'
import { TRPCError } from '@trpc/server'
import { createClaimSchema } from '@claimscrub/shared/schemas'
import type { Validation } from '@prisma/client'
import {
  TRIAL_CLAIMS_PER_DAY,
  TRIAL_MB_PER_DAY,
  getUsageStats,
  checkTrialUploadLimit,
} from '../../services/usage.service.js'

export const claimsRouter = router({
  // Get usage stats for trial limits
  usageStats: protectedProcedure.query(async ({ ctx }) => {
    return getUsageStats(ctx.user.practiceId)
  }),

  // Check if file upload is allowed (for trial users)
  checkUploadLimit: protectedProcedure
    .input(z.object({ fileSizeBytes: z.number() }))
    .query(async ({ ctx, input }) => {
      return checkTrialUploadLimit(ctx.user.practiceId, input.fileSizeBytes)
    }),

  // List claims for current practice
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['DRAFT', 'VALIDATING', 'VALIDATED', 'SUBMITTED', 'ACCEPTED', 'PAID', 'DENIED', 'APPEALING']).optional(),
        page: z.number().default(1),
        pageSize: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { status, page, pageSize } = input
      const skip = (page - 1) * pageSize

      const where = {
        practiceId: ctx.user.practiceId,
        ...(status && { status }),
      }

      const [claims, total] = await Promise.all([
        ctx.prisma.claim.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
          include: {
            serviceLines: true,
            validations: true,
          },
        }),
        ctx.prisma.claim.count({ where }),
      ])

      return {
        items: claims,
        total,
        page,
        pageSize,
        hasMore: skip + claims.length < total,
      }
    }),

  // Get single claim
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const claim = await ctx.prisma.claim.findFirst({
        where: {
          id: input.id,
          practiceId: ctx.user.practiceId,
        },
        include: {
          serviceLines: true,
          validations: true,
        },
      })

      if (!claim) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // Audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'VIEW_CLAIM',
          resource: 'Claim',
          resourceId: claim.id,
          ipAddress: ctx.ip,
          userAgent: ctx.userAgent,
        },
      })

      return claim
    }),

  // Create claim (from agentic flow)
  create: protectedProcedure
    .input(createClaimSchema)
    .mutation(async ({ ctx, input }) => {
      // Check trial claim limit (1 claim per day for trial users)
      const subscription = await ctx.prisma.subscription.findFirst({
        where: { practice: { id: ctx.user.practiceId } },
      })

      if (subscription?.status === 'TRIALING') {
        // Get today's start (midnight)
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        // Count claims created today
        const claimsToday = await ctx.prisma.claim.count({
          where: {
            practiceId: ctx.user.practiceId,
            createdAt: { gte: todayStart },
          },
        })

        if (claimsToday >= TRIAL_CLAIMS_PER_DAY) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Trial limit reached. You can create ${TRIAL_CLAIMS_PER_DAY} claim per day (up to ${TRIAL_MB_PER_DAY}MB) during your free trial. Upgrade to continue.`,
          })
        }
      }

      // Calculate total charge
      const totalCharge = input.serviceLines.reduce(
        (sum, line) => sum + line.charge * line.units,
        0
      )

      // Create claim with service lines
      const claim = await ctx.prisma.claim.create({
        data: {
          patientName: input.patientName,
          patientDob: input.patientDob,
          patientGender: input.patientGender,
          insuranceId: input.insuranceId,
          payerName: input.payerName,
          payerId: input.payerId,
          providerNpi: input.providerNpi,
          providerName: input.providerName,
          dateOfService: input.dateOfService,
          placeOfService: input.placeOfService,
          priorAuthNumber: input.priorAuthNumber,
          totalCharge,
          status: 'DRAFT',
          practiceId: ctx.user.practiceId,
          createdById: ctx.user.id,
          serviceLines: {
            create: input.serviceLines.map((line) => ({
              lineNumber: line.lineNumber,
              cptCode: line.cptCode,
              modifiers: line.modifiers,
              icdCodes: line.icdCodes,
              drugCode: line.drugCode,
              drugUnits: line.drugUnits,
              units: line.units,
              charge: line.charge,
            })),
          },
        },
        include: {
          serviceLines: true,
        },
      })

      // Audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'CREATE_CLAIM',
          resource: 'Claim',
          resourceId: claim.id,
          ipAddress: ctx.ip,
          userAgent: ctx.userAgent,
        },
      })

      return claim
    }),

  // Submit claim
  submit: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const claim = await ctx.prisma.claim.findFirst({
        where: {
          id: input.id,
          practiceId: ctx.user.practiceId,
        },
        include: {
          validations: true,
        },
      })

      if (!claim) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // Check all validations pass
      const hasFailures = claim.validations.some((v: Validation) => v.status === 'FAIL')
      if (hasFailures) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot submit claim with failed validations',
        })
      }

      // Update status
      const updatedClaim = await ctx.prisma.claim.update({
        where: { id: input.id },
        data: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      })

      // Audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'SUBMIT_CLAIM',
          resource: 'Claim',
          resourceId: claim.id,
          ipAddress: ctx.ip,
          userAgent: ctx.userAgent,
        },
      })

      return updatedClaim
    }),
})
