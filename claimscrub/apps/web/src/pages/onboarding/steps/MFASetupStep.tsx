import { useState, useRef, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button, Card } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * MFASetupStep - Two-factor authentication setup (required)
 *
 * Per design mockup: 08_onboarding.md - Step 4
 *
 * Required for HIPAA compliance. Features:
 * - QR code for authenticator apps
 * - Manual code entry fallback
 * - 6-digit verification code input
 */

interface MFASetupStepProps {
  onNext: (data: { mfaEnabled: boolean }) => void
  onBack: () => void
}

const AUTHENTICATOR_APPS = [
  { name: 'Google Authenticator', icon: 'G' },
  { name: 'Authy', icon: 'A' },
  { name: '1Password', icon: '1P' },
]

export function MFASetupStep({ onNext, onBack }: MFASetupStepProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // In production: generate secret and QR code via API
  // const { data: mfaSetup } = trpc.auth.generateMfaSecret.useQuery()
  const mfaSecret = 'JBSWY3DPEHPK3PXP' // Demo secret

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1)

    const newCode = [...code]
    newCode[index] = digit
    setCode(newCode)
    setError(null)

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace - move to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i] ?? ''
    }

    setCode(newCode)

    // Focus last filled input or first empty
    const focusIndex = Math.min(pastedData.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerify = async () => {
    const fullCode = code.join('')

    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsVerifying(true)
    setError(null)

    // In production: verify code via API
    // const result = await trpc.auth.verifyMfa.mutateAsync({ code: fullCode })

    // Simulate verification
    setTimeout(() => {
      // Demo: accept any code starting with 1
      if (fullCode.startsWith('1')) {
        onNext({ mfaEnabled: true })
      } else {
        setError('Invalid code. Please check your authenticator and try again.')
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
      setIsVerifying(false)
    }, 1000)
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-neutral-900 text-center">
        Secure Your Account
      </h2>
      <p className="mt-2 text-neutral-600 text-center">
        Two-factor authentication is required for HIPAA compliance.
      </p>

      <div className="mt-8 space-y-6">
        {/* Step 1: Download App */}
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">
            1. Download an authenticator app
          </p>
          <div className="flex gap-3">
            {AUTHENTICATOR_APPS.map((app) => (
              <button
                key={app.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <span className="w-6 h-6 rounded bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                  {app.icon}
                </span>
                <span className="text-sm text-neutral-700">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-neutral-200" />

        {/* Step 2: QR Code */}
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">
            2. Scan this QR code with your authenticator app
          </p>
          <div className="flex flex-col items-center">
            {/* QR Code Placeholder */}
            <div className="w-40 h-40 rounded-lg bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded border border-neutral-300 flex items-center justify-center">
                <span className="text-xs text-neutral-400 text-center">
                  [QR Code]
                </span>
              </div>
            </div>

            {/* Manual Entry Fallback */}
            <p className="mt-4 text-sm text-neutral-500">
              Can't scan? Enter this code manually:
            </p>
            <code className="mt-1 px-3 py-1.5 rounded bg-neutral-100 font-mono text-sm text-neutral-900 tracking-wider">
              {mfaSecret}
            </code>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-neutral-200" />

        {/* Step 3: Enter Code */}
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">
            3. Enter the 6-digit code from your app
          </p>

          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={cn(
                  'w-12 h-14 text-center text-2xl font-semibold rounded-lg border focus:ring-2 focus:outline-none',
                  error
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20'
                    : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20'
                )}
                maxLength={1}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-error-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </div>
    </div>
  )
}
