import { useState } from 'react'
import { CreditCard, Plus, Edit, Trash2 } from 'lucide-react'
import { Button, Card, Modal, ModalHeader, ModalBody, ModalFooter } from '@claimscrub/ui'
import { cn } from '@/lib/utils'

/**
 * PaymentMethod Component
 *
 * Displays and manages payment methods.
 * Per design mockup: 06_pricing_plans.md - Payment Method section
 *
 * Features:
 * - Display saved cards
 * - Edit/remove payment methods
 * - Add new payment method (opens Stripe)
 */

interface PaymentCard {
  id: string
  brand: 'visa' | 'mastercard' | 'amex' | 'discover'
  last4: string
  expMonth: number
  expYear: number
  isDefault?: boolean
}

const brandLogos: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
}

const brandColors: Record<string, string> = {
  visa: 'text-blue-600',
  mastercard: 'text-orange-600',
  amex: 'text-blue-800',
  discover: 'text-orange-500',
}

interface PaymentMethodProps {
  cards: PaymentCard[]
  onAddCard?: () => void
  onEditCard?: (cardId: string) => void
  onRemoveCard?: (cardId: string) => void
  onSetDefault?: (cardId: string) => void
  className?: string
}

export function PaymentMethod({
  cards,
  onAddCard,
  onEditCard,
  onRemoveCard,
  onSetDefault,
  className,
}: PaymentMethodProps) {
  const [removeModalOpen, setRemoveModalOpen] = useState(false)
  const [cardToRemove, setCardToRemove] = useState<string | null>(null)

  const handleRemoveClick = (cardId: string) => {
    setCardToRemove(cardId)
    setRemoveModalOpen(true)
  }

  const confirmRemove = () => {
    if (cardToRemove) {
      onRemoveCard?.(cardToRemove)
    }
    setRemoveModalOpen(false)
    setCardToRemove(null)
  }

  return (
    <>
      <Card className={cn('p-6', className)}>
        <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-6">
          Payment Method
        </h3>

        {/* Saved Cards */}
        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border',
                card.isDefault ? 'border-primary-200 bg-primary-50' : 'border-neutral-200'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn('font-bold text-lg', brandColors[card.brand])}>
                  {brandLogos[card.brand]}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">
                    {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} ending in {card.last4}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Expires {card.expMonth.toString().padStart(2, '0')}/{card.expYear.toString().slice(-2)}
                  </p>
                </div>
                {card.isDefault && (
                  <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 text-xs font-medium">
                    Default
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!card.isDefault && onSetDefault && (
                  <button
                    onClick={() => onSetDefault(card.id)}
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => onEditCard?.(card.id)}
                  className="p-2 text-neutral-400 hover:text-neutral-600"
                  aria-label="Edit card"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {!card.isDefault && (
                  <button
                    onClick={() => handleRemoveClick(card.id)}
                    className="p-2 text-neutral-400 hover:text-error-600"
                    aria-label="Remove card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {cards.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No payment method on file</p>
            </div>
          )}
        </div>

        {/* Add Payment Method */}
        <Button
          variant="secondary"
          className="mt-4"
          onClick={onAddCard}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </Card>

      {/* Remove Confirmation Modal */}
      <Modal open={removeModalOpen} onOpenChange={setRemoveModalOpen}>
        <ModalHeader>Remove Payment Method</ModalHeader>
        <ModalBody>
          <p className="text-neutral-600">
            Are you sure you want to remove this payment method? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setRemoveModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove}>
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

/**
 * InvoiceHistory Component
 *
 * Displays a list of past invoices.
 */
interface Invoice {
  id: string
  date: string
  amount: string
  status: 'paid' | 'pending' | 'failed'
  downloadUrl?: string
}

interface InvoiceHistoryProps {
  invoices: Invoice[]
  onDownload?: (invoiceId: string) => void
  className?: string
}

export function InvoiceHistory({ invoices, onDownload, className }: InvoiceHistoryProps) {
  const statusStyles = {
    paid: 'bg-success-100 text-success-700',
    pending: 'bg-warning-100 text-warning-700',
    failed: 'bg-error-100 text-error-700',
  }

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-6">
        Invoice History
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="pb-3 text-left text-sm font-semibold text-neutral-700">Date</th>
              <th className="pb-3 text-left text-sm font-semibold text-neutral-700">Amount</th>
              <th className="pb-3 text-left text-sm font-semibold text-neutral-700">Status</th>
              <th className="pb-3 text-right text-sm font-semibold text-neutral-700">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-neutral-100">
                <td className="py-3 text-neutral-900">{invoice.date}</td>
                <td className="py-3 text-neutral-900">{invoice.amount}</td>
                <td className="py-3">
                  <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium capitalize', statusStyles[invoice.status])}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  {invoice.downloadUrl && (
                    <button
                      onClick={() => onDownload?.(invoice.id)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <p className="text-center py-8 text-neutral-500">No invoices yet</p>
      )}
    </Card>
  )
}
