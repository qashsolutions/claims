/**
 * AskDenali tRPC Router
 *
 * Public endpoint for the AskDenali chat assistant.
 * No authentication required - allows potential customers to ask questions.
 */

import { z } from 'zod'
import { router, publicProcedure } from '../index.js'
import { TRPCError } from '@trpc/server'
import { checkGuardrails } from '../../services/askDenali/guardrails.js'
import { askDenaliChatService } from '../../services/askDenali/chatService.js'

// Chat message schema
const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(1000),
})

// Chat input schema
const chatInputSchema = z.object({
  message: z.string().min(1).max(500),
  history: z.array(chatMessageSchema).max(20).optional(),
})

// Chat response schema
const chatResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  blocked: z.boolean(),
})

export const askDenaliRouter = router({
  /**
   * Chat endpoint
   *
   * Public (no auth required) - allows potential customers to ask questions
   * about Denali Health's features, pricing, and capabilities.
   *
   * Implements guardrails to:
   * - Block PHI (protected health information)
   * - Block profanity
   * - Filter off-topic questions
   * - Enforce English-only
   */
  chat: publicProcedure
    .input(chatInputSchema)
    .output(chatResponseSchema)
    .mutation(async ({ input }) => {
      const { message, history = [] } = input

      // 1. Run guardrails check before calling Claude
      const guardrailResult = checkGuardrails(message)

      if (!guardrailResult.allowed) {
        // Return guardrail message as assistant response
        return {
          success: true,
          message: guardrailResult.reason || 'Message blocked by guardrails.',
          blocked: true,
        }
      }

      // 2. Call Claude via chat service
      const response = await askDenaliChatService.chat(
        guardrailResult.sanitizedInput || message,
        history
      )

      // 3. Handle errors
      if (response.error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: response.error,
        })
      }

      return {
        success: true,
        message: response.message,
        blocked: false,
      }
    }),
})
