import { Card } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * DenialRiskChart Component
 *
 * Horizontal bar chart showing denial risk distribution by code.
 * Per design mockup 02_dashboard.md:
 *
 * Chart Type: Horizontal bar (Recharts)
 *
 * Example data:
 * - CO-11: 34%
 * - CO-15: 26%
 * - CO-16: 18%
 * - CO-4: 12%
 * - Other: 10%
 *
 * NOTE: In production, this would use Recharts.
 * For now, we implement a simple CSS-based chart.
 *
 * @example
 * ```tsx
 * <DenialRiskChart
 *   data={[
 *     { code: 'CO-11', label: 'Diagnosis Mismatch', percentage: 34 },
 *     { code: 'CO-15', label: 'Auth Required', percentage: 26 },
 *   ]}
 * />
 * ```
 */

interface ChartData {
  code: string
  label?: string
  percentage: number
  color?: string
}

interface DenialRiskChartProps {
  data: ChartData[]
  title?: string
  className?: string
}

export function DenialRiskChart({
  data,
  title = 'Denial Risk by Code',
  className,
}: DenialRiskChartProps) {
  // Default colors for bars
  const defaultColors = [
    'bg-error-500',      // CO-11 - highest risk
    'bg-warning-500',    // CO-15
    'bg-amber-400',      // CO-16
    'bg-primary-400',    // CO-4
    'bg-neutral-400',    // Other
  ]

  // Get denial code description
  const getCodeDescription = (code: string) => {
    const descriptions: Record<string, string> = {
      'CO-11': 'Diagnosis Mismatch',
      'CO-15': 'Auth Required',
      'CO-16': 'Missing Info',
      'CO-4': 'Modifier Issue',
      'CO-18': 'Duplicate',
      'CO-29': 'Timely Filing',
      'CO-50': 'Not Medically Necessary',
      'CO-96': 'Non-Covered',
      'CO-97': 'Bundling',
      'Other': 'Other Codes',
    }
    return descriptions[code] || code
  }

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.code} className="space-y-1">
            {/* Label Row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-neutral-700">
                  {item.code}
                </span>
                {item.label && (
                  <span className="text-neutral-500 hidden sm:inline">
                    {item.label}
                  </span>
                )}
              </div>
              <span className="font-medium text-neutral-900">
                {item.percentage}%
              </span>
            </div>

            {/* Bar */}
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  item.color || defaultColors[index] || 'bg-primary-500'
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="py-8 text-center text-neutral-500">
          No denial data available.
        </div>
      )}
    </Card>
  )
}

/**
 * SpecialtyChart - Claims by specialty breakdown
 *
 * Similar horizontal bar chart for specialty distribution.
 */
interface SpecialtyChartProps {
  data: Array<{
    specialty: string
    percentage: number
    color?: string
  }>
  title?: string
  className?: string
}

export function SpecialtyChart({
  data,
  title = 'Claims by Specialty',
  className,
}: SpecialtyChartProps) {
  // Default colors for specialties
  const specialtyColors: Record<string, string> = {
    'Mental Health': 'bg-purple-500',
    'Oncology': 'bg-rose-500',
    'OB-GYN': 'bg-pink-500',
    'Endocrinology': 'bg-blue-500',
    'Cardiology': 'bg-red-500',
    'Neurology': 'bg-indigo-500',
    'Orthopedics': 'bg-green-500',
    'Other': 'bg-neutral-400',
  }

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.specialty} className="space-y-1">
            {/* Label Row */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-700">{item.specialty}</span>
              <span className="font-medium text-neutral-900">
                {item.percentage}%
              </span>
            </div>

            {/* Bar */}
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  item.color || specialtyColors[item.specialty] || 'bg-primary-500'
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="py-8 text-center text-neutral-500">
          No specialty data available.
        </div>
      )}
    </Card>
  )
}

/**
 * ChartGrid - Container for side-by-side charts
 *
 * Responsive behavior per design spec:
 * - Desktop: 2 columns
 * - Mobile (< 768px): Stacked vertically
 */
interface ChartGridProps {
  children: React.ReactNode
  className?: string
}

export function ChartGrid({ children, className }: ChartGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        'grid-cols-1 md:grid-cols-2',
        className
      )}
    >
      {children}
    </div>
  )
}
