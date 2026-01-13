import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * StatCard Component
 *
 * Displays a key metric with trend indicator.
 * Per design mockup 02_dashboard.md:
 *
 * Specifications:
 * - Height: 120px
 * - Padding: 24px
 * - Number: 36px, Merriweather, Slate-900
 * - Label: 14px, Inter, Slate-500
 * - Change: 12px, green/red based on direction
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Claims Today"
 *   value={47}
 *   change={{ value: 12, label: 'from yesterday', direction: 'up' }}
 *   onClick={() => navigate('/claims?filter=today')}
 * />
 * ```
 */

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  change?: {
    value: number | string
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  format?: 'number' | 'percent' | 'currency'
  onClick?: () => void
  className?: string
}

export function StatCard({
  label,
  value,
  icon,
  change,
  format = 'number',
  onClick,
  className,
}: StatCardProps) {
  // Format the value based on type
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val

    switch (format) {
      case 'percent':
        return `${val.toFixed(1)}%`
      case 'currency':
        return `$${val.toLocaleString()}`
      case 'number':
      default:
        return val.toLocaleString()
    }
  }

  // Trend icon and color
  const getTrendConfig = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return {
          icon: <TrendingUp className="h-3 w-3" />,
          color: 'text-success-600',
          prefix: '+',
        }
      case 'down':
        return {
          icon: <TrendingDown className="h-3 w-3" />,
          color: 'text-error-600',
          prefix: '-',
        }
      case 'neutral':
      default:
        return {
          icon: <Minus className="h-3 w-3" />,
          color: 'text-neutral-500',
          prefix: '',
        }
    }
  }

  const trendConfig = change ? getTrendConfig(change.direction) : null

  return (
    <Card
      className={cn(
        'h-[120px] p-6 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:border-primary-200',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex flex-col justify-between h-full">
          {/* Label */}
          <span className="text-sm text-neutral-500">{label}</span>

          {/* Value - 36px Merriweather per spec */}
          <span className="font-heading text-4xl font-bold text-neutral-900">
            {formatValue(value)}
          </span>

          {/* Change Indicator */}
          {change && trendConfig && (
            <div className={cn('flex items-center gap-1 text-xs', trendConfig.color)}>
              {trendConfig.icon}
              <span>
                {trendConfig.prefix}{change.value} {change.label}
              </span>
            </div>
          )}
        </div>

        {/* Optional Icon */}
        {icon && (
          <div className="text-neutral-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

/**
 * StatCardGrid - Grid container for stat cards
 *
 * Responsive behavior per design spec:
 * - Desktop: 4 columns
 * - Tablet (< 768px): 2x2 grid
 * - Mobile (< 640px): Single column
 */
interface StatCardGridProps {
  children: ReactNode
  className?: string
}

export function StatCardGrid({ children, className }: StatCardGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  )
}
