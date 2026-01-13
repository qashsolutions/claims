import { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@claimscrub/ui'
import {
  CurrentPlanCard,
  UsageStats,
  PaymentMethod,
  InvoiceHistory,
  PricingCards,
} from '@/components/billing'

/**
 * BillingPage - Subscription and billing management
 *
 * Per design mockup: 06_pricing_plans.md - Billing Settings section
 *
 * Features:
 * - Current plan display
 * - Usage statistics
 * - Payment method management
 * - Invoice history
 * - Plan change modal
 */

export function BillingPage() {
  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false)

  // In production, this data comes from tRPC queries
  // const { data: subscription } = trpc.billing.getSubscription.useQuery()
  // const { data: usage } = trpc.billing.getUsage.useQuery()
  // const { data: invoices } = trpc.billing.getInvoices.useQuery()

  const subscription = {
    planName: 'Unlimited Monthly',
    price: '$100/month',
    status: 'active' as const,
    nextInvoiceDate: 'Feb 12, 2026',
    nextInvoiceAmount: '$100.00',
  }

  const usageStats = [
    { label: 'Claims Validated', value: 347, max: 1000 },
    { label: 'Data Processed', value: '2.4', unit: 'GB' },
    { label: 'API Calls', value: 1247 },
  ]

  const paymentCards = [
    {
      id: '1',
      brand: 'visa' as const,
      last4: '4242',
      expMonth: 12,
      expYear: 2027,
      isDefault: true,
    },
  ]

  const invoices = [
    { id: '1', date: 'Jan 12, 2026', amount: '$100.00', status: 'paid' as const, downloadUrl: '#' },
    { id: '2', date: 'Dec 12, 2025', amount: '$100.00', status: 'paid' as const, downloadUrl: '#' },
    { id: '3', date: 'Nov 12, 2025', amount: '$100.00', status: 'paid' as const, downloadUrl: '#' },
  ]

  const handleChangePlan = () => {
    setChangePlanModalOpen(true)
  }

  const handleSelectPlan = (planId: string) => {
    // In production: call tRPC mutation to change plan
    console.log('Select plan:', planId)
    setChangePlanModalOpen(false)
  }

  const handleAddCard = () => {
    // In production: redirect to Stripe checkout or open Stripe Elements modal
    console.log('Add card')
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    // In production: download PDF from Stripe
    console.log('Download invoice:', invoiceId)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Billing</h1>
        <p className="text-neutral-500">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan & Next Invoice */}
      <CurrentPlanCard
        planName={subscription.planName}
        price={subscription.price}
        status={subscription.status}
        nextInvoiceDate={subscription.nextInvoiceDate}
        nextInvoiceAmount={subscription.nextInvoiceAmount}
        onChangePlan={handleChangePlan}
      />

      {/* Usage Statistics */}
      <UsageStats stats={usageStats} />

      {/* Payment Methods */}
      <PaymentMethod
        cards={paymentCards}
        onAddCard={handleAddCard}
        onEditCard={(id) => console.log('Edit card:', id)}
        onRemoveCard={(id) => console.log('Remove card:', id)}
        onSetDefault={(id) => console.log('Set default:', id)}
      />

      {/* Invoice History */}
      <InvoiceHistory
        invoices={invoices}
        onDownload={handleDownloadInvoice}
      />

      {/* Change Plan Modal */}
      <Modal open={changePlanModalOpen} onOpenChange={setChangePlanModalOpen}>
        <ModalHeader>Change Your Plan</ModalHeader>
        <ModalBody className="max-w-4xl">
          <p className="text-neutral-600 mb-6">
            Current: <strong>{subscription.planName}</strong> ({subscription.price})
          </p>
          <PricingCards
            onSelectPlan={handleSelectPlan}
            currentPlan="unlimited"
          />
          <div className="mt-6 p-4 rounded-lg bg-neutral-50">
            <p className="text-sm text-neutral-600">
              Your new plan will take effect immediately. You'll be charged a prorated amount.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setChangePlanModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
