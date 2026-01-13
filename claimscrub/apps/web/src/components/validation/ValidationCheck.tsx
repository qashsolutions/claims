import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, Badge } from '@claimscrub/ui'
import { cn } from '@/lib/utils'
import { DenialRiskBadge } from './DenialRiskBadge'
import { SuggestedFix } from './SuggestedFix'
import type { Validation } from '@claimscrub/shared'

/**
 * ValidationCheck Component
 *
 * Displays an individual validation check result with expandable details.
 * Per design mockup 04_validation_results.md:
 *
 * Card Structure:
 * - Container: White bg, slate-200 border, 8px radius
 * - Status Icon: 20px, positioned left
 * - Title: 16px, Inter semibold, Slate-900
 * - Status Badge: 12px, right-aligned
 * - Description: 14px, Inter regular, Slate-600
 * - Recommendation: 14px, sage-700 on sage-50 background
 *
 * Status Icons:
 * - PASS: CheckCircle (sage-600)
 * - WARN: AlertTriangle (amber-600)
 * - FAIL: XCircle (rose-600)
 *
 * @example
 * ```tsx
 * <ValidationCheck
 *   validation={{
 *     id: '1',
 *     type: 'CPT_ICD_MATCH',
 *     status: 'PASS',
 *     message: 'C50.911 (Breast cancer) supports CPT 96413',
 *   }}
 * />
 * ```
 */

interface ValidationCheckProps {
  validation: Validation
  onApplySuggestion?: (suggestion: { code: string; type: 'icd' | 'cpt' | 'modifier' }) => void
}

export function ValidationCheck({ validation, onApplySuggestion }: ValidationCheckProps) {
  const [expanded, setExpanded] = useState(validation.status !== 'PASS')

  // Status-specific styles
  const statusConfig = {
    PASS: {
      icon: <CheckCircle className="h-5 w-5 text-success-600" />,
      badge: 'success' as const,
      badgeText: 'PASS',
      containerClass: '',
    },
    WARN: {
      icon: <AlertTriangle className="h-5 w-5 text-warning-600" />,
      badge: 'warning' as const,
      badgeText: 'WARNING',
      containerClass: 'border-warning-200 bg-warning-50/30',
    },
    FAIL: {
      icon: <XCircle className="h-5 w-5 text-error-600" />,
      badge: 'error' as const,
      badgeText: 'FAIL',
      containerClass: 'border-error-200 bg-error-50/30',
    },
  }

  const config = statusConfig[validation.status]

  // Get friendly name for validation type
  const getTypeName = (type: string) => {
    const typeNames: Record<string, string> = {
      CPT_ICD_MATCH: 'CPT-ICD Match',
      PROVIDER_VERIFICATION: 'Provider Verification',
      MODIFIER_VALIDATION: 'Modifier Validation',
      PRIOR_AUTH: 'Prior Authorization',
      DATA_COMPLETENESS: 'Data Completeness',
      TIMELY_FILING: 'Timely Filing',
      NCCI_EDITS: 'NCCI Edits',
      NPI_VALIDATION: 'NPI Validation',
    }
    return typeNames[type] || type.replace(/_/g, ' ')
  }

  const hasDetails = validation.status !== 'PASS' && (
    validation.recommendation ||
    validation.suggestedCodes?.length ||
    validation.denialCode
  )

  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white overflow-hidden',
        'transition-all duration-200',
        config.containerClass
      )}
    >
      {/* Header Row */}
      <button
        onClick={() => hasDetails && setExpanded(!expanded)}
        disabled={!hasDetails}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3',
          'text-left',
          hasDetails && 'cursor-pointer hover:bg-neutral-50'
        )}
      >
        {/* Status Icon */}
        <div className="flex-shrink-0">{config.icon}</div>

        {/* Title and Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {getTypeName(validation.type)}
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-0.5 line-clamp-1">
            {validation.message}
          </p>
        </div>

        {/* Status Badge */}
        <Badge variant={config.badge} className="flex-shrink-0">
          {config.badgeText}
        </Badge>

        {/* Expand/Collapse Icon */}
        {hasDetails && (
          <div className="flex-shrink-0 text-neutral-400">
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        )}
      </button>

      {/* Expanded Content */}
      {expanded && hasDetails && (
        <div className="px-4 pb-4 pt-2 border-t border-neutral-100">
          {/* Full Message */}
          {validation.message && validation.status !== 'PASS' && (
            <div className="mb-3">
              <p className="text-sm text-neutral-700">{validation.message}</p>
            </div>
          )}

          {/* Denial Risk Badge */}
          {validation.denialCode && (
            <div className="mb-3">
              <DenialRiskBadge
                code={validation.denialCode}
                description={validation.denialDescription}
              />
            </div>
          )}

          {/* Recommendation */}
          {validation.recommendation && (
            <div className="mb-3 p-3 rounded-md bg-neutral-50 border border-neutral-200">
              <h5 className="text-sm font-medium text-neutral-700 mb-1">Recommendation</h5>
              <p className="text-sm text-neutral-600">{validation.recommendation}</p>
            </div>
          )}

          {/* Suggested Codes */}
          {validation.suggestedCodes && validation.suggestedCodes.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-neutral-700">
                Suggested {validation.type === 'CPT_ICD_MATCH' ? 'ICD-10' : ''} Codes
              </h5>
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 space-y-2">
                {validation.suggestedCodes.map((suggestion, idx) => (
                  <SuggestedFix
                    key={idx}
                    code={suggestion.code}
                    description={suggestion.description}
                    onApply={() => onApplySuggestion?.({
                      code: suggestion.code,
                      type: suggestion.type || 'icd',
                    })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {validation.status !== 'PASS' && (
            <div className="mt-4 flex items-center gap-2">
              {validation.actionButtons?.map((action, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
