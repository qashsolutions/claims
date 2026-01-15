/**
 * useVoiceSpeech Hook
 *
 * Wraps the Web Speech API for voice input.
 * Features:
 * - Start/stop recording
 * - Interim results for visual feedback
 * - Final transcript on completion
 * - Error handling for unsupported browsers
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseVoiceSpeechOptions {
  onResult?: (transcript: string) => void
  onInterim?: (transcript: string) => void
  onError?: (error: string) => void
  language?: string
}

interface UseVoiceSpeechReturn {
  isListening: boolean
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  transcript: string
  interimTranscript: string
  error: string | null
}

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
  onend: ((this: SpeechRecognition, ev: Event) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function useVoiceSpeech(options: UseVoiceSpeechOptions = {}): UseVoiceSpeechReturn {
  const { onResult, onInterim, onError, language = 'en-US' } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Use refs for callbacks to avoid recreating recognition on every render
  const onResultRef = useRef(onResult)
  const onInterimRef = useRef(onInterim)
  const onErrorRef = useRef(onError)

  // Keep refs updated
  useEffect(() => {
    onResultRef.current = onResult
    onInterimRef.current = onInterim
    onErrorRef.current = onError
  }, [onResult, onInterim, onError])

  // Check browser support
  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionAPI()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => {
      console.log('[VoiceSpeech] Recognition started')
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('[VoiceSpeech] onresult fired', event.results)
      let finalTranscript = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result || !result[0]) continue

        if (result.isFinal) {
          finalTranscript += result[0].transcript
          console.log('[VoiceSpeech] Final transcript:', finalTranscript)
        } else {
          interim += result[0].transcript
          console.log('[VoiceSpeech] Interim transcript:', interim)
        }
      }

      if (interim) {
        setInterimTranscript(interim)
        onInterimRef.current?.(interim)
      }

      if (finalTranscript) {
        setTranscript(finalTranscript)
        setInterimTranscript('')
        console.log('[VoiceSpeech] Calling onResult with:', finalTranscript)
        onResultRef.current?.(finalTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[VoiceSpeech] Error:', event.error)
      let errorMessage = 'Voice recognition error'

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'audio-capture':
          errorMessage = 'Microphone not available. Please check permissions.'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable in browser settings.'
          break
        case 'network':
          errorMessage = 'Network error. Please check your connection.'
          break
        case 'aborted':
          // User aborted - not an error
          setIsListening(false)
          return
      }

      setError(errorMessage)
      setIsListening(false)
      onErrorRef.current?.(errorMessage)
    }

    recognition.onend = () => {
      console.log('[VoiceSpeech] Recognition ended')
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [isSupported, language]) // Removed callback dependencies - using refs instead

  const startListening = useCallback(() => {
    console.log('[VoiceSpeech] startListening called, isSupported:', isSupported, 'recognition:', !!recognitionRef.current)
    if (!isSupported || !recognitionRef.current) {
      setError('Voice input is not supported in this browser')
      return
    }

    setTranscript('')
    setInterimTranscript('')
    setError(null)

    try {
      console.log('[VoiceSpeech] Calling recognition.start()')
      recognitionRef.current.start()
    } catch (err) {
      console.error('[VoiceSpeech] Error starting recognition:', err)
      // Already started - ignore
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
    error,
  }
}
