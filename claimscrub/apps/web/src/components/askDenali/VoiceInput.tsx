/**
 * VoiceInput Component
 *
 * Microphone button with visual feedback during recording.
 * Falls back gracefully on unsupported browsers.
 */

import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

interface VoiceInputProps {
  isListening: boolean
  isSupported: boolean
  isProcessing: boolean
  onStart: () => void
  onStop: () => void
  interimText?: string
  className?: string
}

export function VoiceInput({
  isListening,
  isSupported,
  isProcessing,
  onStart,
  onStop,
  interimText,
  className,
}: VoiceInputProps) {
  if (!isSupported) {
    return null // Don't show if not supported
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant={isListening ? 'danger' : 'secondary'}
        size="icon"
        onClick={isListening ? onStop : onStart}
        disabled={isProcessing}
        className={cn('relative', isListening && 'animate-pulse')}
        aria-label={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}

        {/* Recording indicator */}
        {isListening && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
        )}
      </Button>

      {/* Interim transcript display */}
      {isListening && interimText && (
        <span className="text-sm text-neutral-500 italic truncate max-w-[200px]">
          {interimText}...
        </span>
      )}
    </div>
  )
}
