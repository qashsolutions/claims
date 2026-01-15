/**
 * ChatInput Component
 *
 * Text input with send button and voice input toggle.
 */

import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@claimscrub/ui'
import { VoiceInput } from './VoiceInput'
import { cn } from '@/lib/utils'

interface VoiceState {
  isListening: boolean
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  interimTranscript: string
}

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  voiceState: VoiceState
  className?: string
}

export function ChatInput({ onSend, isLoading, voiceState, className }: ChatInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center gap-2', className)}>
      <VoiceInput
        isListening={voiceState.isListening}
        isSupported={voiceState.isSupported}
        isProcessing={isLoading}
        onStart={voiceState.startListening}
        onStop={voiceState.stopListening}
        interimText={voiceState.interimTranscript}
      />

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            voiceState.isListening ? 'Listening...' : 'Ask Nico...'
          }
          disabled={isLoading || voiceState.isListening}
          className={cn(
            'w-full px-4 py-2.5 pr-12',
            'rounded-lg border border-neutral-200',
            'text-sm text-neutral-900 placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-neutral-50 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
