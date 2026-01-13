import { Card } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * UsageStats Component
 *
 * Displays current billing period usage statistics.
 * Per design mockup: 06_pricing_plans.md - Billing Settings section
 *
 * Shows:
 * - Claims validated
 * - Data processed
 * - API calls
 */

interface UsageStat {
  label: string
  value: number | string
  max?: number
  unit?: string
}

interface UsageStatsProps {
  stats: UsageStat[]
  className?: string
}

export function UsageStats({ stats, className }: UsageStatsProps) {
  return (
    <Card className={cn('p-6', className)}>
      <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-6">
        Usage This Period
      </h3>
      <div className="space-y-6">
        {stats.map((stat, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">{stat.label}</span>
              <span className="font-semibold text-neutral-900">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                {stat.unit && <span className="text-neutral-500 ml-1">{stat.unit}</span>}
              </span>
            </div>
            {stat.max && (
              <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-600 transition-all duration-500"
                  style={{
                    width: `${Math.min((Number(stat.value) / stat.max) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

/**
 * CurrentPlanCard Component
 *
 * Displays the current subscription plan details.
 */
interface CurrentPlanCardProps {
  planName: string
  price: string
  status: 'active' | 'trialing' | 'past_due' | 'canceled'
  nextInvoiceDate?: string
  nextInvoiceAmount?: string
  onChangePlan?: () => void
  onViewInvoices?: () => void
  className?: string
}

export function CurrentPlanCard({
  planName,
  price,
  status,
  nextInvoiceDate,
  nextInvoiceAmount,
  onChangePlan,
  onViewInvoices,
  className,
}: CurrentPlanCardProps) {
  const statusStyles = {
    active: 'bg-success-100 text-success-700',
    trialing: 'bg-primary-100 text-primary-700',
    past_due: 'bg-warning-100 text-warning-700',
    canceled: 'bg-neutral-100 text-neutral-700',
  }

  const statusLabels = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past Due',
    canceled: 'Canceled',
  }

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-6">
        Current Plan
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-500">Plan</p>
            <p className="text-xl font-semibold text-neutral-900">{planName}</p>
            <p className="text-neutral-600">{price}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-1 rounded-md text-sm font-medium', statusStyles[status])}>
              {statusLabels[status]}
            </span>
          </div>
          <button
            onClick={onChangePlan}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Change Plan
          </button>
        </div>

        {/* Next Invoice */}
        {nextInvoiceDate && nextInvoiceAmount && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-500">Next Invoice</p>
              <p className="text-xl font-semibold text-neutral-900">{nextInvoiceDate}</p>
              <p className="text-neutral-600">{nextInvoiceAmount}</p>
            </div>
            <button
              onClick={onViewInvoices}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View Invoice History
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
