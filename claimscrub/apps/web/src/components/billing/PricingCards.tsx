import { Check, Minus } from 'lucide-react'
import { Button, Card, Badge } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * PricingCards Component
 *
 * Displays pricing tiers for ClaimScrub subscriptions.
 * Per design mockup: 06_pricing_plans.md
 *
 * Three plans:
 * - Free Trial: $0 for 3 days
 * - Pay Per Claim: $10/claim
 * - Unlimited: $100/month (featured)
 */

interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: { label: string; included: boolean }[]
  cta: string
  featured?: boolean
}

const plans: PricingPlan[] = [
  {
    id: 'free-trial',
    name: 'Free Trial',
    price: 0,
    period: 'for 3 days',
    description: 'Try ClaimScrub risk-free',
    features: [
      { label: '1 claim per day', included: true },
      { label: 'Up to 10 MB each', included: true },
      { label: 'All 4 specialties', included: true },
      { label: 'Basic validation', included: true },
      { label: 'Email support', included: true },
      { label: 'Chat assistant', included: false },
      { label: 'API access', included: false },
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'pay-per-claim',
    name: 'Pay Per Claim',
    price: 10,
    period: 'per claim',
    description: 'Pay only for what you use',
    features: [
      { label: 'Unlimited claims', included: true },
      { label: 'Up to 10 MB each', included: true },
      { label: 'All 4 specialties', included: true },
      { label: 'Full validation', included: true },
      { label: 'Email support', included: true },
      { label: 'Chat assistant', included: true },
      { label: 'API access', included: false },
    ],
    cta: 'Get Started',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 100,
    period: 'per month',
    description: 'Best value for high volume',
    features: [
      { label: 'Unlimited claims', included: true },
      { label: 'All file sizes', included: true },
      { label: 'All 4 specialties', included: true },
      { label: 'Full validation', included: true },
      { label: 'Priority support', included: true },
      { label: 'Chat assistant', included: true },
      { label: 'API access', included: true },
      { label: 'Analytics dashboard', included: true },
      { label: 'Epic EHR launch', included: true },
    ],
    cta: 'Subscribe',
    featured: true,
  },
]

interface PricingCardsProps {
  onSelectPlan?: (planId: string) => void
  currentPlan?: string
  className?: string
}

export function PricingCards({ onSelectPlan, currentPlan, className }: PricingCardsProps) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-3', className)}>
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            'relative flex flex-col p-8',
            plan.featured && 'border-2 border-primary-600 shadow-lg'
          )}
        >
          {/* Featured Badge */}
          {plan.featured && (
            <Badge
              variant="primary"
              className="absolute -top-3 left-1/2 -translate-x-1/2"
            >
              Most Popular
            </Badge>
          )}

          {/* Plan Name */}
          <h3 className="font-heading text-xl font-semibold text-neutral-900">
            {plan.name}
          </h3>

          {/* Price */}
          <div className="mt-4">
            <span className="font-heading text-5xl font-bold text-neutral-900">
              ${plan.price}
            </span>
            <span className="ml-2 text-neutral-500">{plan.period}</span>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm text-neutral-500">{plan.description}</p>

          {/* Features List */}
          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                {feature.included ? (
                  <Check className="h-4 w-4 text-success-600" />
                ) : (
                  <Minus className="h-4 w-4 text-neutral-300" />
                )}
                <span
                  className={cn(
                    'text-sm',
                    feature.included ? 'text-neutral-700' : 'text-neutral-400'
                  )}
                >
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            className="mt-6 w-full"
            variant={plan.featured ? 'primary' : 'secondary'}
            onClick={() => onSelectPlan?.(plan.id)}
            disabled={currentPlan === plan.id}
          >
            {currentPlan === plan.id ? 'Current Plan' : plan.cta}
          </Button>
        </Card>
      ))}
    </div>
  )
}

/**
 * AnnualSavings Component
 *
 * Displays the annual billing option with savings.
 */
interface AnnualSavingsProps {
  onSwitchToAnnual?: () => void
  className?: string
}

export function AnnualSavings({ onSwitchToAnnual, className }: AnnualSavingsProps) {
  return (
    <Card className={cn('p-6 bg-success-50 border-success-200', className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="font-heading text-lg font-semibold text-success-800">
            Save 30% with Annual Billing
          </h4>
          <p className="text-success-700">
            Unlimited Plan: $70/month when paid annually ($840/year)
          </p>
        </div>
        <Button variant="primary" onClick={onSwitchToAnnual}>
          Switch to Annual
        </Button>
      </div>
    </Card>
  )
}

/**
 * SuccessFeesPreview Component
 *
 * Preview of Phase 3 success-based pricing for denial appeals.
 */
interface SuccessFeesPreviewProps {
  onJoinWaitlist?: () => void
  className?: string
}

export function SuccessFeesPreview({ onJoinWaitlist, className }: SuccessFeesPreviewProps) {
  return (
    <Card className={cn('p-6', className)}>
      <Badge variant="outline" className="mb-4">Coming Q2 2026</Badge>
      <h4 className="font-heading text-lg font-semibold text-neutral-900">
        Denial Appeals - Success-Based Pricing
      </h4>
      <p className="mt-2 text-neutral-600">
        Pay only when we help you recover denied claims.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-primary-50 p-4">
          <p className="text-3xl font-bold text-primary-900">5%</p>
          <p className="text-sm text-primary-700">of recovered amount</p>
          <div className="mt-3 pt-3 border-t border-primary-200">
            <p className="text-xs text-primary-600">Industry Average: 15-25%</p>
            <p className="text-sm font-medium text-primary-800">Your Savings: Up to 80%</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-neutral-600">
          <p className="font-medium text-neutral-900">How it works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Upload your denied claim (835 EOB)</li>
            <li>We generate an appeal with clinical evidence</li>
            <li>Submit appeal to payer</li>
            <li>When payment is received, we charge 5%</li>
          </ol>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-neutral-50">
        <p className="text-sm font-medium text-neutral-700">Example:</p>
        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">Denied claim</p>
            <p className="font-medium text-neutral-900">$5,000</p>
          </div>
          <div>
            <p className="text-neutral-500">Our fee (5%)</p>
            <p className="font-medium text-neutral-900">$225</p>
          </div>
          <div>
            <p className="text-neutral-500">Your recovery</p>
            <p className="font-medium text-success-600">$4,275</p>
          </div>
        </div>
      </div>

      <Button variant="secondary" className="mt-6" onClick={onJoinWaitlist}>
        Join Waitlist
      </Button>
    </Card>
  )
}
