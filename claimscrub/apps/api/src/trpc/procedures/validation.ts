import { z } from 'zod'
import { router, protectedProcedure } from '../index.js'
import { validationService } from '../../services/validation.service.js'

export const validationRouter = router({
  // Validate CPT-ICD match
  validateCptIcd: protectedProcedure
    .input(
      z.object({
        cptCode: z.string(),
        icdCodes: z.array(z.string()),
        specialty: z.enum(['ONCOLOGY', 'MENTAL_HEALTH', 'OBGYN', 'ENDOCRINOLOGY']).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await validationService.validateCptIcdMatch(
        input.cptCode,
        input.icdCodes,
        input.specialty
      )

      return result
    }),

  // Check prior auth requirements
  checkAuth: protectedProcedure
    .input(
      z.object({
        cptCode: z.string(),
        drugCode: z.string().optional(),
        payerId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await validationService.checkAuthRequirements(
        input.cptCode,
        input.drugCode,
        input.payerId
      )

      return result
    }),

  // Verify NPI
  verifyNpi: protectedProcedure
    .input(z.object({ npi: z.string() }))
    .mutation(async ({ input }) => {
      const result = await validationService.verifyNpi(input.npi)
      return result
    }),

  // Check NCCI edits
  checkNcci: protectedProcedure
    .input(
      z.object({
        cptCodes: z.array(z.string()),
        modifiers: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const result = await validationService.checkNcciEdits(
        input.cptCodes,
        input.modifiers
      )
      return result
    }),

  // Check timely filing
  checkTimelyFiling: protectedProcedure
    .input(
      z.object({
        dateOfService: z.date(),
        payerId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await validationService.checkTimelyFiling(
        input.dateOfService,
        input.payerId
      )
      return result
    }),

  // Suggest ICD codes for CPT
  suggestIcdCodes: protectedProcedure
    .input(
      z.object({
        cptCode: z.string(),
        patientConditions: z.array(z.string()).optional(),
        specialty: z.enum(['ONCOLOGY', 'MENTAL_HEALTH', 'OBGYN', 'ENDOCRINOLOGY']).optional(),
      })
    )
    .query(async ({ input }) => {
      const suggestions = await validationService.suggestIcdCodes(
        input.cptCode,
        input.patientConditions,
        input.specialty
      )
      return suggestions
    }),

  // Get modifier suggestions
  suggestModifiers: protectedProcedure
    .input(
      z.object({
        cptCode: z.string(),
        drugCode: z.string().optional(),
        placeOfService: z.string(),
      })
    )
    .query(async ({ input }) => {
      const suggestions = await validationService.suggestModifiers(
        input.cptCode,
        input.drugCode,
        input.placeOfService
      )
      return suggestions
    }),

  // Run all validations for a claim
  validateClaim: protectedProcedure
    .input(
      z.object({
        claimId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const claim = await ctx.prisma.claim.findFirst({
        where: {
          id: input.claimId,
          practiceId: ctx.user.practiceId,
        },
        include: { serviceLines: true },
      })

      if (!claim) {
        throw new Error('Claim not found')
      }

      // Run all validations
      const validations = await validationService.runAllValidations(claim)

      // Store validation results
      await ctx.prisma.validation.deleteMany({
        where: { claimId: claim.id },
      })

      await ctx.prisma.validation.createMany({
        data: validations.map((v) => ({
          claimId: claim.id,
          checkType: v.checkType,
          status: v.status,
          denialCode: v.denialCode,
          message: v.message,
          suggestion: v.suggestion,
          metadata: v.metadata,
        })),
      })

      // Calculate score
      const passCount = validations.filter((v) => v.status === 'PASS').length
      const score = Math.round((passCount / validations.length) * 100)

      await ctx.prisma.claim.update({
        where: { id: claim.id },
        data: {
          score,
          status: validations.some((v) => v.status === 'FAIL')
            ? 'DRAFT'
            : 'VALIDATED',
        },
      })

      return {
        score,
        validations,
      }
    }),
})
