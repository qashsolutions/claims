import { Button } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * SuggestedFix Component
 *
 * Displays a suggested code fix with an apply button.
 * Used within ValidationCheck for showing ICD-10, CPT, or modifier suggestions.
 *
 * Per design mockup 04_validation_results.md:
 * ```
 * | Suggested ICD-10 Codes for CPT 96413:                  |
 * |                                                        |
 * | C50.911 - Malignant neoplasm, right female breast      |
 * | C34.90 - Malignant neoplasm, unspecified lung          |
 * | C18.9  - Malignant neoplasm, colon unspecified         |
 * | C61    - Malignant neoplasm of prostate                |
 * |                                                        |
 * | [Apply C50.911]  [View All Suggestions]                |
 * ```
 *
 * @example
 * ```tsx
 * <SuggestedFix
 *   code="C50.911"
 *   description="Malignant neoplasm, right female breast"
 *   onApply={() => applyCode('C50.911')}
 * />
 * ```
 */

interface SuggestedFixProps {
  code: string
  description: string
  type?: 'icd' | 'cpt' | 'modifier' | 'hcpcs'
  confidence?: number
  onApply?: () => void
  className?: string
}

export function SuggestedFix({
  code,
  description,
  type = 'icd',
  confidence,
  onApply,
  className,
}: SuggestedFixProps) {
  // Type label for display
  const typeLabels = {
    icd: 'ICD-10',
    cpt: 'CPT',
    modifier: 'Modifier',
    hcpcs: 'HCPCS',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-2',
        'border-b border-neutral-100 last:border-0',
        className
      )}
    >
      {/* Code and Description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-neutral-900">{code}</span>
          {confidence !== undefined && (
            <span className="text-xs text-neutral-500">
              ({Math.round(confidence * 100)}% match)
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-600 truncate">{description}</p>
      </div>

      {/* Apply Button */}
      {onApply && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onApply}
          className="flex-shrink-0"
        >
          Apply {code}
        </Button>
      )}
    </div>
  )
}

/**
 * SuggestedFixList - Container for multiple suggestions with "View All" option
 */
interface SuggestedFixListProps {
  suggestions: Array<{
    code: string
    description: string
    type?: 'icd' | 'cpt' | 'modifier' | 'hcpcs'
    confidence?: number
  }>
  title?: string
  maxVisible?: number
  onApply?: (code: string) => void
  onViewAll?: () => void
  className?: string
}

export function SuggestedFixList({
  suggestions,
  title,
  maxVisible = 4,
  onApply,
  onViewAll,
  className,
}: SuggestedFixListProps) {
  const visibleSuggestions = suggestions.slice(0, maxVisible)
  const hasMore = suggestions.length > maxVisible

  return (
    <div className={cn('rounded-md border border-neutral-200 bg-neutral-50', className)}>
      {/* Title */}
      {title && (
        <div className="px-3 py-2 border-b border-neutral-200">
          <h5 className="text-sm font-medium text-neutral-700">{title}</h5>
        </div>
      )}

      {/* Suggestions */}
      <div className="px-3 py-1">
        {visibleSuggestions.map((suggestion, idx) => (
          <SuggestedFix
            key={idx}
            code={suggestion.code}
            description={suggestion.description}
            type={suggestion.type}
            confidence={suggestion.confidence}
            onApply={onApply ? () => onApply(suggestion.code) : undefined}
          />
        ))}
      </div>

      {/* View All Button */}
      {hasMore && onViewAll && (
        <div className="px-3 py-2 border-t border-neutral-200">
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All {suggestions.length} Suggestions
          </Button>
        </div>
      )}
    </div>
  )
}
