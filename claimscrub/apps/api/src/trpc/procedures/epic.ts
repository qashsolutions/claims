import { z } from 'zod'
import { router, protectedProcedure } from '../index.js'
import { TRPCError } from '@trpc/server'
import { epicClient } from '../../services/epic/client.js'
import type { EpicTokens } from '@claimscrub/shared'

export const epicRouter = router({
  // Get patient by ID from Epic FHIR
  getPatient: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.epicTokens) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Epic not connected. Please connect your Epic account.',
        })
      }

      const patient = await epicClient.getPatient(
        input.patientId,
        ctx.user.epicTokens as EpicTokens
      )

      // Audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'VIEW_PATIENT',
          resource: 'Patient',
          resourceId: input.patientId,
          ipAddress: ctx.ip,
          userAgent: ctx.userAgent,
        },
      })

      return patient
    }),

  // Search patients
  searchPatients: protectedProcedure
    .input(
      z.object({
        query: z.string().min(2),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user.epicTokens) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Epic not connected',
        })
      }

      const patients = await epicClient.searchPatients(
        input.query,
        ctx.user.epicTokens as EpicTokens,
        input.limit
      )

      return patients
    }),

  // Get patient conditions (active diagnoses)
  getConditions: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user.epicTokens) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Epic not connected',
        })
      }

      const conditions = await epicClient.getConditions(
        input.patientId,
        ctx.user.epicTokens as EpicTokens
      )

      return conditions
    }),

  // Get patient coverage (insurance)
  getCoverage: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user.epicTokens) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Epic not connected',
        })
      }

      const coverage = await epicClient.getCoverage(
        input.patientId,
        ctx.user.epicTokens as EpicTokens
      )

      return coverage
    }),

  // Check for existing prior authorizations
  getAuthorizations: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        cptCode: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user.epicTokens) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Epic not connected',
        })
      }

      const auths = await epicClient.getAuthorizations(
        input.patientId,
        ctx.user.epicTokens as EpicTokens,
        input.cptCode
      )

      return auths
    }),

  // OAuth callback handler
  handleCallback: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tokens = await epicClient.exchangeCode(input.code)

      // Store encrypted tokens
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          epicTokens: tokens,
          epicUserId: tokens.patientId,
        },
      })

      // Mark practice as connected
      await ctx.prisma.practice.update({
        where: { id: ctx.user.practiceId },
        data: { epicConnected: true },
      })

      return { success: true }
    }),

  // Check connection status
  status: protectedProcedure.query(async ({ ctx }) => {
    return {
      connected: !!ctx.user.epicTokens,
      epicUserId: ctx.user.epicUserId,
    }
  }),
})
