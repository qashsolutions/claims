import { useState } from 'react'
import { useFlow } from '../FlowProvider'
import { SuggestionCard } from '../SuggestionCard'
import { KeyboardHint } from '../KeyboardHint'
import { ConfirmButton } from '../ConfirmButton'
import { CheckCircle, Clock, Pill } from 'lucide-react'

interface ProcedureSuggestion {
  cptCode: string
  description: string
  category: string
  drugCode?: string
  drugName?: string
  units: number
  charge: number
  confidence: number
  modifiers: Array<{ code: string; description: string; required: boolean }>
}

// Mock suggestions - in production, from Claude + Epic
const MOCK_SUGGESTIONS: ProcedureSuggestion[] = [
  {
    cptCode: '96413',
    description: 'Chemotherapy administration, IV infusion',
    category: 'Oncology',
    drugCode: 'J9271',
    drugName: 'Pembrolizumab (Keytruda)',
    units: 1,
    charge: 9650,
    confidence: 0.95,
    modifiers: [
      { code: 'JW', description: 'Drug amount discarded', required: true },
    ],
  },
  {
    cptCode: '96415',
    description: 'Chemotherapy, IV infusion, additional hour',
    category: 'Oncology',
    units: 1,
    charge: 850,
    confidence: 0.85,
    modifiers: [],
  },
]

/**
 * Step 2: Procedure Select
 * AI-suggested procedures based on patient context
 * Matches: 09_agentic_procedure_suggest.svg
 */
export function ProcedureSelect() {
  const { context, selectProcedure, goBack } = useFlow()
  const [selected, setSelected] = useState<ProcedureSuggestion | null>(null)
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([])

  const handleSelect = (procedure: ProcedureSuggestion) => {
    setSelected(procedure)
    // Auto-select required modifiers
    const requiredMods = procedure.modifiers
      .filter((m) => m.required)
      .map((m) => m.code)
    setSelectedModifiers(requiredMods)
  }

  const handleConfirm = () => {
    if (!selected) return

    selectProcedure({
      cptCode: selected.cptCode,
      cptDescription: selected.description,
      drugCode: selected.drugCode,
      drugUnits: selected.units,
      units: selected.units,
      charge: selected.charge,
      modifiers: selectedModifiers,
    })
  }

  const toggleModifier = (code: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(code)
        ? prev.filter((m) => m !== code)
        : [...prev, code]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-neutral-900">
            Select Procedure
          </h3>
          <p className="text-body-sm text-neutral-500">
            AI-suggested based on scheduled treatment for{' '}
            {context.patient?.firstName}
          </p>
        </div>
        <KeyboardHint />
      </div>

      {/* Suggestion Cards */}
      <div className="space-y-3">
        {MOCK_SUGGESTIONS.map((procedure, idx) => (
          <SuggestionCard
            key={procedure.cptCode}
            selected={selected?.cptCode === procedure.cptCode}
            onClick={() => handleSelect(procedure)}
            tabIndex={idx + 1}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="code text-lg font-semibold text-neutral-900">
                    {procedure.cptCode}
                  </span>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {procedure.category}
                  </span>
                  {procedure.confidence >= 0.9 && (
                    <span className="flex items-center gap-1 rounded-md bg-success-100 px-2 py-0.5 text-xs text-success-700">
                      <CheckCircle className="h-3 w-3" />
                      Best match
                    </span>
                  )}
                </div>
                <p className="mt-1 text-neutral-700">{procedure.description}</p>

                {/* Drug info */}
                {procedure.drugCode && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                    <Pill className="h-4 w-4 text-blue-600" />
                    <span className="code text-body-sm text-blue-700">
                      {procedure.drugCode}
                    </span>
                    <span className="text-body-sm text-blue-700">
                      {procedure.drugName}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="font-semibold text-neutral-900">
                  ${procedure.charge.toLocaleString()}
                </p>
                <p className="text-body-sm text-neutral-500">
                  {procedure.units} unit{procedure.units > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Modifiers (shown when selected) */}
            {selected?.cptCode === procedure.cptCode && procedure.modifiers.length > 0 && (
              <div className="mt-4 border-t border-neutral-200 pt-4">
                <p className="mb-2 text-body-sm font-medium text-neutral-700">
                  Suggested Modifiers
                </p>
                <div className="flex flex-wrap gap-2">
                  {procedure.modifiers.map((mod) => (
                    <button
                      key={mod.code}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleModifier(mod.code)
                      }}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                        selectedModifiers.includes(mod.code)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      <span className="code font-medium">{mod.code}</span>
                      <span className="text-body-sm">{mod.description}</span>
                      {mod.required && (
                        <span className="text-xs text-warning-600">(Required)</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </SuggestionCard>
        ))}
      </div>

      {/* Schedule info */}
      <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-3 text-body-sm text-neutral-600">
        <Clock className="h-4 w-4" />
        <span>Based on scheduled infusion appointment today at 9:00 AM</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={goBack}
          className="rounded-lg border border-neutral-200 bg-white px-6 py-3 text-neutral-600 hover:bg-neutral-50"
        >
          Back
        </button>

        <ConfirmButton onClick={handleConfirm} disabled={!selected}>
          Continue
        </ConfirmButton>
      </div>
    </div>
  )
}
