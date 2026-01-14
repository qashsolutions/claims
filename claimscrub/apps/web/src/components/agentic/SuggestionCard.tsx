import { Card, Badge, cn } from '@claimscrub/ui'

interface SuggestionCardProps {
  title?: string
  description?: string
  badge?: string
  badgeVariant?: 'success' | 'warning' | 'primary'
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
  tabIndex?: number
}

export function SuggestionCard({
  title,
  description,
  badge,
  badgeVariant = 'primary',
  selected,
  disabled,
  onClick,
  children,
  tabIndex,
}: SuggestionCardProps) {
  return (
    <Card
      variant={selected ? 'success' : 'outlined'}
      interactive={!disabled}
      className={cn(
        'p-4',
        disabled && 'cursor-not-allowed opacity-50',
        selected && 'ring-2 ring-success-500'
      )}
      onClick={disabled ? undefined : onClick}
      tabIndex={tabIndex}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-neutral-900">{title}</span>
            {badge && (
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="mt-1 text-body-sm text-neutral-600">{description}</p>
          )}
        </div>
        {selected && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {children}
    </Card>
  )
}
