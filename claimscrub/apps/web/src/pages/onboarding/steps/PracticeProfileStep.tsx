import { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { Button, Card } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * PracticeProfileStep - Practice information setup (required)
 *
 * Per design mockup: 08_onboarding.md - Step 3
 *
 * Collects:
 * - Practice name
 * - Primary specialty
 * - Practice NPI (with auto-lookup)
 * - User role
 */

interface PracticeProfileStepProps {
  data: {
    practiceName: string
    specialty: string
    npi: string
    role: string
  }
  onNext: (data: {
    practiceName: string
    specialty: string
    npi: string
    role: string
  }) => void
  onBack: () => void
}

const SPECIALTIES = [
  { value: 'oncology', label: 'Oncology' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'obgyn', label: 'OB/GYN' },
  { value: 'endocrinology', label: 'Endocrinology' },
]

const ROLES = [
  { value: 'provider', label: 'Provider / Physician' },
  { value: 'billing', label: 'Billing Staff' },
  { value: 'admin', label: 'Practice Administrator' },
]

interface NpiLookupResult {
  name: string
  address: string
}

export function PracticeProfileStep({ data, onNext, onBack }: PracticeProfileStepProps) {
  const [form, setForm] = useState({
    practiceName: data.practiceName || '',
    specialty: data.specialty || '',
    npi: data.npi || '',
    role: data.role || '',
  })
  const [npiLookup, setNpiLookup] = useState<NpiLookupResult | null>(null)
  const [npiError, setNpiError] = useState<string | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)

  // Validate NPI using Luhn algorithm
  const validateNpi = (npi: string): boolean => {
    if (npi.length !== 10 || !/^\d+$/.test(npi)) return false

    // NPI Luhn check
    const prefix = '80840'
    const fullNumber = prefix + npi
    let sum = 0
    let alternate = false

    for (let i = fullNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(fullNumber[i] ?? '0', 10)
      if (alternate) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      alternate = !alternate
    }

    return sum % 10 === 0
  }

  const handleNpiChange = async (npi: string) => {
    setForm((prev) => ({ ...prev, npi }))
    setNpiError(null)
    setNpiLookup(null)

    if (npi.length === 10) {
      if (!validateNpi(npi)) {
        setNpiError('This NPI is not valid. Please check and try again.')
        return
      }

      setIsLookingUp(true)
      // In production: call NPI registry API
      // const result = await trpc.npi.lookup.mutateAsync({ npi })

      // Simulate API response
      setTimeout(() => {
        setNpiLookup({
          name: 'Memorial Health System - Oncology',
          address: '123 Medical Center Dr, Boston, MA',
        })
        setIsLookingUp(false)
      }, 500)
    }
  }

  const handleSubmit = () => {
    if (!form.practiceName || !form.specialty || !form.npi || !form.role) {
      return // Form validation
    }
    onNext(form)
  }

  const isValid = form.practiceName && form.specialty && form.npi && form.role && !npiError

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-neutral-900 text-center">
        Set Up Your Practice
      </h2>

      <div className="mt-8 space-y-5">
        {/* Practice Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Practice Name <span className="text-error-600">*</span>
          </label>
          <input
            type="text"
            value={form.practiceName}
            onChange={(e) => setForm((prev) => ({ ...prev, practiceName: e.target.value }))}
            placeholder="e.g., Memorial Health Oncology"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Primary Specialty <span className="text-error-600">*</span>
          </label>
          <select
            value={form.specialty}
            onChange={(e) => setForm((prev) => ({ ...prev, specialty: e.target.value }))}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">Select specialty...</option>
            {SPECIALTIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* NPI */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Practice NPI <span className="text-error-600">*</span>
          </label>
          <input
            type="text"
            value={form.npi}
            onChange={(e) => handleNpiChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit NPI"
            maxLength={10}
            className={cn(
              'w-full rounded-lg border px-4 py-2.5 focus:ring-2',
              npiError
                ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20'
            )}
          />

          {/* NPI Error */}
          {npiError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-error-600">
              <AlertCircle className="h-4 w-4" />
              {npiError}
            </div>
          )}

          {/* NPI Lookup Result */}
          {isLookingUp && (
            <div className="mt-2 text-sm text-neutral-500">Looking up NPI...</div>
          )}
          {npiLookup && (
            <Card className="mt-2 p-3 bg-success-50 border-success-200">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-success-600 mt-0.5" />
                <div>
                  <p className="font-medium text-success-800">{npiLookup.name}</p>
                  <p className="text-sm text-success-700">{npiLookup.address}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Your Role <span className="text-error-600">*</span>
          </label>
          <div className="space-y-2">
            {ROLES.map((role) => (
              <label
                key={role.value}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                  form.role === role.value
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-neutral-200 hover:bg-neutral-50'
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={form.role === role.value}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-neutral-900">{role.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  )
}
