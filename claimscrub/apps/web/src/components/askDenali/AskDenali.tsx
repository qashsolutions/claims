/**
 * AskDenali Component
 *
 * Main chat assistant component. Can be used as:
 * - Floating button that opens a modal (default)
 * - Embedded inline component
 *
 * Features:
 * - Voice input (Web Speech API)
 * - Text input fallback
 * - Conversation history
 * - Error handling
 * - Loading states
 */

import { useState, useCallback } from 'react'
import { MessageCircle, X, Trash2 } from 'lucide-react'
import { Button, Card } from '@claimscrub/ui'
import { trpc } from '@/lib/trpc'
import { useVoiceSpeech } from '@/hooks/useVoiceSpeech'
import { ChatMessages, type ChatMessage } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { cn } from '@/lib/utils'

export interface AskDenaliProps {
  /** Render as floating button (default) or inline */
  variant?: 'floating' | 'inline'
  /** Custom class name */
  className?: string
}

export function AskDenali({ variant = 'floating', className }: AskDenaliProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  // tRPC mutation for chat
  const chatMutation = trpc.askDenali.chat.useMutation({
    onError: (err) => {
      setError(err.message)
    },
  })

  // Voice input
  const voiceState = useVoiceSpeech({
    onResult: (transcript) => {
      handleSendMessage(transcript)
    },
    onError: (err) => {
      setError(err)
    },
  })

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return

      // Add user message to history
      const userMessage: ChatMessage = { role: 'user', content: message }
      setMessages((prev) => [...prev, userMessage])
      setError(null)

      // Call API
      const response = await chatMutation.mutateAsync({
        message,
        history: messages,
      })

      if (response.blocked) {
        // Guardrails blocked the message - show the reason as assistant message
        setMessages((prev) => [...prev, { role: 'assistant', content: response.message }])
      } else if (response.success) {
        // Add assistant response
        setMessages((prev) => [...prev, { role: 'assistant', content: response.message }])
      }
    },
    [messages, chatMutation]
  )

  const handleClearHistory = () => {
    setMessages([])
    setError(null)
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <Card className={cn('flex flex-col h-[500px]', className)}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary-600" />
            <span className="font-heading font-semibold">Nico</span>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearHistory}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <ChatMessages
          messages={messages}
          isLoading={chatMutation.isPending}
          onSuggestionClick={handleSendMessage}
          className="flex-1 p-4"
        />

        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-t border-red-200">
            {error}
          </div>
        )}

        <div className="p-4 border-t border-neutral-200">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={chatMutation.isPending}
            voiceState={{
              isListening: voiceState.isListening,
              isSupported: voiceState.isSupported,
              startListening: voiceState.startListening,
              stopListening: voiceState.stopListening,
              interimTranscript: voiceState.interimTranscript,
            }}
          />
        </div>
      </Card>
    )
  }

  // Floating variant (default)
  return (
    <>
      {/* Floating trigger button */}
      <Button
        variant="primary"
        size="lg"
        className={cn(
          'fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50',
          isOpen && 'hidden',
          className
        )}
        onClick={() => setIsOpen(true)}
        aria-label="Open Nico assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] min-w-[320px] h-full sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl border border-neutral-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-neutral-900">Nico</h3>
                <p className="text-xs text-neutral-500">Your AI assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button variant="ghost" size="icon" onClick={handleClearHistory} title="Clear chat">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} title="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ChatMessages
            messages={messages}
            isLoading={chatMutation.isPending}
            onSuggestionClick={handleSendMessage}
            className="flex-1 p-4"
          />

          {/* Error */}
          {error && (
            <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-t border-red-200">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-neutral-200">
            <ChatInput
              onSend={handleSendMessage}
              isLoading={chatMutation.isPending}
              voiceState={{
                isListening: voiceState.isListening,
                isSupported: voiceState.isSupported,
                startListening: voiceState.startListening,
                stopListening: voiceState.stopListening,
                interimTranscript: voiceState.interimTranscript,
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
