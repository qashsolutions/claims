/**
 * AskDenali Chat Service
 *
 * Wraps Claude API for product-focused conversations.
 * Uses system prompt to enforce:
 * - Simple English responses
 * - Product-focused answers
 * - Helpful, friendly tone
 */

import Anthropic from '@anthropic-ai/sdk'
import { buildKnowledgeBase } from './knowledgeBase.js'

const SYSTEM_PROMPT = `You are AskDenali, a helpful AI assistant for Denali Health - a healthcare claims scrubbing application that helps medical practices prevent claim denials.

Your role is to help users understand:
- How Denali Health works and its benefits
- Pricing and subscription plans
- The 7 validation rules and how they prevent denials
- Supported specialties (Oncology, Mental Health, OB-GYN, Endocrinology)
- Common denial codes and how to avoid them
- How to get started with the platform

GUIDELINES:
1. Use simple, plain English - avoid jargon unless explaining a specific term
2. Be friendly, helpful, and concise
3. Keep answers to 2-4 sentences unless more detail is needed
4. If asked about topics unrelated to Denali Health, politely redirect
5. Never invent features or pricing - only mention what's in your knowledge base
6. Encourage users to start a free trial when appropriate
7. Do not ask for or accept any personal health information (PHI)

KNOWLEDGE BASE:
{KNOWLEDGE_BASE}`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  message: string
  error?: string
}

export class AskDenaliChatService {
  private client: Anthropic | null = null
  private model: string
  private knowledgeBase: string

  constructor() {
    console.log('[AskDenali ChatService] Initializing...')
    const apiKey = process.env.ANTHROPIC_API_KEY
    console.log('[AskDenali ChatService] ANTHROPIC_API_KEY present:', !!apiKey)
    if (apiKey) {
      this.client = new Anthropic({ apiKey })
      console.log('[AskDenali ChatService] Anthropic client initialized')
    } else {
      console.warn('[AskDenali ChatService] No API key - client not initialized')
    }
    this.model = 'claude-sonnet-4-20250514'
    console.log('[AskDenali ChatService] Building knowledge base...')
    this.knowledgeBase = buildKnowledgeBase()
    console.log('[AskDenali ChatService] Knowledge base built, length:', this.knowledgeBase.length)
  }

  /**
   * Process a chat message and return a response
   *
   * @param userMessage - The user's message
   * @param conversationHistory - Previous messages in the conversation
   * @returns Response from Claude
   */
  async chat(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    console.log('[AskDenali ChatService] chat() called with message:', userMessage)
    console.log('[AskDenali ChatService] History length:', conversationHistory.length)

    // Check if API client is available
    if (!this.client) {
      console.error('[AskDenali ChatService] Client not available - returning error')
      return {
        message: '',
        error: 'Chat service is not configured. Please contact support.',
      }
    }

    try {
      const systemPrompt = SYSTEM_PROMPT.replace('{KNOWLEDGE_BASE}', this.knowledgeBase)
      console.log('[AskDenali ChatService] System prompt length:', systemPrompt.length)

      // Build messages array with history
      const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
        ...conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: userMessage },
      ]
      console.log('[AskDenali ChatService] Messages count:', messages.length)

      console.log('[AskDenali ChatService] Calling Claude API with model:', this.model)
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 512,
        temperature: 0.3,
        system: systemPrompt,
        messages,
      })
      console.log('[AskDenali ChatService] Claude API response received, content blocks:', response.content.length)

      // Extract text content from response
      const textContent = response.content.find((block) => block.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        console.error('[AskDenali ChatService] No text content in response')
        throw new Error('No text response from Claude')
      }

      console.log('[AskDenali ChatService] Returning successful response, length:', textContent.text.length)
      return { message: textContent.text }
    } catch (error) {
      console.error('[AskDenali ChatService] Error in chat():', error)
      console.error('[AskDenali ChatService] Error type:', error instanceof Error ? error.constructor.name : typeof error)
      if (error instanceof Error) {
        console.error('[AskDenali ChatService] Error message:', error.message)
        console.error('[AskDenali ChatService] Error stack:', error.stack)
      }

      // Return user-friendly error message
      if (error instanceof Anthropic.APIError) {
        console.error('[AskDenali ChatService] Anthropic API error, status:', error.status)
        if (error.status === 429) {
          return {
            message: '',
            error: "I'm receiving too many requests right now. Please try again in a moment.",
          }
        }
        if (error.status === 401) {
          return {
            message: '',
            error: 'Service configuration error. Please contact support.',
          }
        }
      }

      return {
        message: '',
        error: 'Sorry, I encountered an error. Please try again.',
      }
    }
  }
}

// Export singleton instance
export const askDenaliChatService = new AskDenaliChatService()
