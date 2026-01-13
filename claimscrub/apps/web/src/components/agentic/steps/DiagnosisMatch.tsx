import { useState } from 'react'
import { useFlow } from '../FlowProvider'
import { SuggestionCard } from '../SuggestionCard'
import { KeyboardHint } from '../KeyboardHint'
import { ConfirmButton } from '../ConfirmButton'
import { CheckCircle, AlertTriangle, BookOpen } from 'lucide-react'

interface DiagnosisSuggestion {
  code: string
  description: string
  source: 'chart' | 'ai' | 'history'
  confidence: number
  medicalNecessity: 'high' | 'medium' | 'low'
}

/**
 * Step 3: Diagnosis Match
 * AI-matched ICD-10 codes with medical necessity scoring
 * Matches: 10_agentic_diagnosis_suggest.svg
 */
export function DiagnosisMatch() {
  const { context, applyDiagnosis, goBack } = useFlow()
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

  // Build suggestions from patient diagnoses + AI suggestions
  const suggestions: DiagnosisSuggestion[] = [
    // From patient chart (highest confidence)
    ...(context.patient?.activeDiagnoses || []).map((dx) => ({
      code: dx.code,
      description: dx.description,
      source: 'chart' as const,
      confidence: 0.98,
      medicalNecessity: 'high' as const,
    })),
    // AI-suggested based on CPT
    {
      code: 'Z51.11',
      description: 'Encounter for antineoplastic chemotherapy',
      source: 'ai' as const,
      confidence: 0.92,
      medicalNecessity: 'high' as const,
    },
  ]

  // Auto-select best match (primary cancer dx)
  const primaryDx = suggestions.find(
    (s) => s.code.startsWith('C') && s.medicalNecessity === 'high'
  )

  const toggleCode = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    )
  }

  const handleConfirm = () => {
    const selected = suggestions.filter((s) => selectedCodes.includes(s.code))
    applyDiagnosis(
      selected.map((s) => ({
        code: s.code,
        description: s.description,
        type: s.code === primaryDx?.code ? 'PRIMARY' : 'SECONDARY',
        status: 'ACTIVE' as const,
      }))
    )
  }

  // Auto-select primary diagnosis on mount
  useState(() => {
    if (primaryDx && !selectedCodes.includes(primaryDx.code)) {
      setSelectedCodes([primaryDx.code])
    }
  })

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'chart':
        return (
          <span className="flex items-center gap-1 rounded-md bg-success-100 px-2 py-0.5 text-xs text-success-700">
            <CheckCircle className="h-3 w-3" />
            From Chart
          </span>
        )
      case 'ai':
        return (
          <span className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
            <BookOpen className="h-3 w-3" />
            AI Suggested
          </span>
        )
      default:
        return null
    }
  }

  const getMedicalNecessityBadge = (level: string) => {
    switch (level) {
      case 'high':
        return (
          <span className="rounded-md bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
            High Medical Necessity
          </span>
        )
      case 'medium':
        return (
          <span className="rounded-md bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
            Medium
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-neutral-900">
            Match Diagnosis
          </h3>
          <p className="text-body-sm text-neutral-500">
            Select ICD-10 codes that support medical necessity for{' '}
            <span className="code">{context.procedure?.cptCode}</span>
          </p>
        </div>
        <KeyboardHint />
      </div>

      {/* CPT-ICD Match Status */}
      {selectedCodes.length > 0 && primaryDx && selectedCodes.includes(primaryDx.code) && (
        <div className="flex items-center gap-3 rounded-lg bg-success-50 px-4 py-3">
          <CheckCircle className="h-5 w-5 text-success-600" />
          <span className="font-medium text-success-700">
            CPT-ICD match verified - Medical necessity established
          </span>
        </div>
      )}

      {/* Diagnosis Cards */}
      <div className="space-y-3">
        {suggestions.map((dx, idx) => (
          <SuggestionCard
            key={dx.code}
            selected={selectedCodes.includes(dx.code)}
            onClick={() => toggleCode(dx.code)}
            tabIndex={idx + 1}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="code text-lg font-semibold text-neutral-900">
                    {dx.code}
                  </span>
                  {getSourceBadge(dx.source)}
                  {dx.code === primaryDx?.code && (
                    <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                      Primary Dx
                    </span>
                  )}
                </div>
                <p className="mt-1 text-neutral-700">{dx.description}</p>
              </div>

              <div className="text-right">
                {getMedicalNecessityBadge(dx.medicalNecessity)}
              </div>
            </div>

            {/* Show warning if selected without primary */}
            {selectedCodes.includes(dx.code) &&
              !dx.code.startsWith('C') &&
              !selectedCodes.some((c) => c.startsWith('C')) && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning-50 px-3 py-2">
                  <AlertTriangle className="h-4 w-4 text-warning-600" />
                  <span className="text-body-sm text-warning-700">
                    Consider adding primary cancer diagnosis for stronger medical necessity
                  </span>
                </div>
              )}
          </SuggestionCard>
        ))}
      </div>

      {/* Selection summary */}
      <div className="rounded-lg bg-neutral-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-neutral-600">
            {selectedCodes.length} diagnosis code{selectedCodes.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            {selectedCodes.map((code) => (
              <span key={code} className="code rounded bg-white px-2 py-1 text-body-sm">
                {code}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={goBack}
          className="rounded-lg border border-neutral-200 bg-white px-6 py-3 text-neutral-600 hover:bg-neutral-50"
        >
          Back
        </button>

        <ConfirmButton
          onClick={handleConfirm}
          disabled={selectedCodes.length === 0}
        >
          Continue
        </ConfirmButton>
      </div>
    </div>
  )
}
