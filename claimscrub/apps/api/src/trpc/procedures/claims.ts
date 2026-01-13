import { z } from 'zod'
import { router, protectedProcedure } from '../index.js'
import { TRPCError } from '@trpc/server'

const createClaimSchema = z.object({
  patientId: z.string(),
  dateOfService: z.date(),
  placeOfService: z.string(),
  priorAuthNumber: z.string().optional(),
  serviceLines: z.array(
    z.object({
      lineNumber: z.number(),
      cptCode: z.string(),
      modifiers: z.array(z.string()),
      icdCodes: z.array(z.string()),
      drugCode: z.string().optional(),
      drugUnits: z.number().optional(),
      units: z.number().default(1),
      charge: z.number(),
    })
  ),
})

export const claimsRouter = router({
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
      // Calculate total charge
      const totalCharge = input.serviceLines.reduce(
        (sum, line) => sum + line.charge * line.units,
        0
      )

      // Create claim with service lines
      const claim = await ctx.prisma.claim.create({
        data: {
          patientName: '', // Will be filled from Epic data
          patientDob: new Date(), // Will be filled from Epic data
          patientGender: '', // Will be filled from Epic data
          insuranceId: '', // Will be filled from Epic data
          payerName: '', // Will be filled from Epic data
          providerNpi: '', // Will be filled from user's practice
          providerName: '', // Will be filled from user's practice
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
      const hasFailures = claim.validations.some((v) => v.status === 'FAIL')
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
