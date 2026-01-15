/**
 * ChatMessages Component
 *
 * Displays conversation history with proper styling
 * for user and assistant messages.
 */

import { useRef, useEffect } from 'react'
import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading?: boolean
  onSuggestionClick?: (suggestion: string) => void
  className?: string
}

const SUGGESTIONS = [
  'What are the pricing plans?',
  'How does validation work?',
  'What specialties do you support?',
]

export function ChatMessages({
  messages,
  isLoading,
  onSuggestionClick,
  className,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-neutral-900">Hi! I'm Nico</h3>
        <p className="text-neutral-500 mt-2 max-w-sm text-sm">
          I can help you learn about Denali Health's pricing, features, validation rules, and how to
          get started.
        </p>
        {onSuggestionClick && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="text-sm px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                onClick={() => onSuggestionClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4 overflow-y-auto', className)}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
        >
          {/* Avatar */}
          <div
            className={cn(
              'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
              message.role === 'user'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700'
            )}
          >
            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>

          {/* Message bubble */}
          <div
            className={cn(
              'max-w-[80%] rounded-2xl px-4 py-2',
              message.role === 'user'
                ? 'bg-primary-600 text-white rounded-tr-sm'
                : 'bg-neutral-100 text-neutral-900 rounded-tl-sm'
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <Bot className="h-4 w-4 text-neutral-700" />
          </div>
          <div className="bg-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex gap-1">
              <span
                className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
