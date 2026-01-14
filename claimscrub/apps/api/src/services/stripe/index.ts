import Stripe from 'stripe'

/**
 * Stripe Services
 *
 * Handles all billing-related operations for ClaimScrub:
 * - Subscription management (create, update, cancel)
 * - Usage-based billing for pay-per-claim
 * - Payment method management
 * - Invoice and receipt generation
 * - Webhook handling for payment events
 *
 * PRICING TIERS:
 * - Free Trial: $0 for 3 days (1 claim/day)
 * - Pay Per Claim: $10/claim
 * - Unlimited Monthly: $100/month
 * - Unlimited Annual: $840/year ($70/month)
 */

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
})

// Price IDs from environment
const PRICES = {
  PAY_PER_CLAIM: process.env.STRIPE_PRICE_PAY_PER_CLAIM || '',
  UNLIMITED_MONTHLY: process.env.STRIPE_PRICE_UNLIMITED_MONTHLY || '',
  UNLIMITED_ANNUAL: process.env.STRIPE_PRICE_UNLIMITED_ANNUAL || '',
}

interface CreateCustomerParams {
  email: string
  name: string
  practiceId: string
  metadata?: Record<string, string>
}

interface CreateSubscriptionParams {
  customerId: string
  priceId: string
  trialDays?: number
}

interface RecordUsageParams {
  subscriptionId: string
  claimId: string
  quantity?: number
}

/**
 * Creates a new Stripe customer for a practice.
 *
 * @param params - Customer details
 * @returns Stripe customer object
 */
export async function createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      practiceId: params.practiceId,
      ...params.metadata,
    },
  })

  return customer
}

/**
 * Creates a subscription for a customer.
 *
 * @param params - Subscription parameters
 * @returns Stripe subscription object
 */
export async function createSubscription(
  params: CreateSubscriptionParams
): Promise<Stripe.Subscription> {
  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: params.customerId,
    items: [{ price: params.priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  }

  // Add trial period if specified
  if (params.trialDays) {
    subscriptionParams.trial_period_days = params.trialDays
  }

  const subscription = await stripe.subscriptions.create(subscriptionParams)
  return subscription
}

/**
 * Creates a free trial subscription.
 *
 * @param customerId - Stripe customer ID
 * @returns Subscription with 3-day trial
 */
export async function createTrialSubscription(customerId: string): Promise<Stripe.Subscription> {
  return createSubscription({
    customerId,
    priceId: PRICES.PAY_PER_CLAIM, // Start with pay-per-claim, trial prevents charges
    trialDays: 3,
  })
}

/**
 * Updates a subscription to a new plan.
 *
 * @param subscriptionId - Current subscription ID
 * @param newPriceId - New price ID to change to
 * @returns Updated subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const itemId = subscription.items.data[0]?.id

  if (!itemId) {
    throw new Error('Subscription has no items')
  }

  return stripe.subscriptions.update(subscriptionId, {
    items: [{ id: itemId, price: newPriceId }],
    proration_behavior: 'create_prorations',
  })
}

/**
 * Cancels a subscription.
 *
 * @param subscriptionId - Subscription to cancel
 * @param immediately - Cancel now or at period end
 * @returns Canceled subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId)
  }

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

/**
 * Records usage for pay-per-claim billing.
 *
 * @param params - Usage record parameters
 * @returns Usage record
 */
export async function recordUsage(
  params: RecordUsageParams
) {
  const subscription = await stripe.subscriptions.retrieve(params.subscriptionId)
  const itemId = subscription.items.data[0]?.id

  if (!itemId) {
    throw new Error('Subscription has no items')
  }

  return stripe.subscriptionItems.createUsageRecord(itemId, {
    quantity: params.quantity || 1,
    timestamp: Math.floor(Date.now() / 1000),
    action: 'increment',
  })
}

/**
 * Gets the current usage for a subscription.
 *
 * @param subscriptionId - Subscription ID
 * @returns Usage summary
 */
export async function getUsage(subscriptionId: string): Promise<{
  claimsThisPeriod: number
  periodStart: Date
  periodEnd: Date
}> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  return {
    claimsThisPeriod: 0, // Would be calculated from usage records
    periodStart: new Date(subscription.current_period_start * 1000),
    periodEnd: new Date(subscription.current_period_end * 1000),
  }
}

/**
 * Creates a Stripe Checkout session for new subscriptions.
 *
 * @param customerId - Stripe customer ID
 * @param priceId - Price to subscribe to
 * @param successUrl - Redirect URL on success
 * @param cancelUrl - Redirect URL on cancel
 * @returns Checkout session
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  })
}

/**
 * Creates a portal session for subscription management.
 *
 * @param customerId - Stripe customer ID
 * @param returnUrl - URL to return to after portal session
 * @returns Billing portal session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

/**
 * Lists invoices for a customer.
 *
 * @param customerId - Stripe customer ID
 * @param limit - Max invoices to return
 * @returns List of invoices
 */
export async function listInvoices(
  customerId: string,
  limit = 10
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  })

  return invoices.data
}

/**
 * Retrieves a specific invoice.
 *
 * @param invoiceId - Invoice ID
 * @returns Invoice details
 */
export async function getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.retrieve(invoiceId)
}

/**
 * Lists payment methods for a customer.
 *
 * @param customerId - Stripe customer ID
 * @returns List of payment methods
 */
export async function listPaymentMethods(
  customerId: string
): Promise<Stripe.PaymentMethod[]> {
  const methods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  })

  return methods.data
}

/**
 * Sets the default payment method for a customer.
 *
 * @param customerId - Stripe customer ID
 * @param paymentMethodId - Payment method to set as default
 * @returns Updated customer
 */
export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.Customer> {
  return stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  }) as Promise<Stripe.Customer>
}

/**
 * Detaches a payment method from a customer.
 *
 * @param paymentMethodId - Payment method to detach
 * @returns Detached payment method
 */
export async function detachPaymentMethod(
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> {
  return stripe.paymentMethods.detach(paymentMethodId)
}

// Export price IDs for use in other modules
export { PRICES }

// Export stripe client for direct access if needed
export { stripe }
