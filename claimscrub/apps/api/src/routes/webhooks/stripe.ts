import { Hono } from 'hono'
import Stripe from 'stripe'
import { prisma } from '../../db/index.js'
import { env } from '../../config/env.js'

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
})

export const stripeWebhook = new Hono()

stripeWebhook.post('/', async (c) => {
  const signature = c.req.header('stripe-signature')

  if (!signature) {
    return c.json({ error: 'Missing stripe-signature header' }, 400)
  }

  const body = await c.req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return c.json({ error: `Webhook Error: ${message}` }, 400)
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(subscription)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      case 'invoice.finalized': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoiceFinalized(invoice)
        break
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription
        await handleTrialWillEnd(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Error processing webhook:', err)
    return c.json({ error: 'Webhook handler failed' }, 500)
  }

  return c.json({ received: true })
})

// Handler functions

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  const subscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        stripeSubscriptionId: subscriptionId,
        status: 'ACTIVE',
      },
    })
  }

  console.log(`Checkout completed for customer: ${customerId}`)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  const planType = mapPriceToPlan(priceId)

  await prisma.subscription.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      stripeSubscriptionId: subscription.id,
      planType,
      status: subscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
    },
  })

  console.log(`Subscription created: ${subscription.id}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id
  const planType = mapPriceToPlan(priceId)
  const status = mapStripeStatus(subscription.status)

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { planType, status },
  })

  console.log(`Subscription updated: ${subscription.id}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'CANCELED' },
  })

  console.log(`Subscription canceled: ${subscription.id}`)
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (subscriptionId) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'ACTIVE',
        claimsThisPeriod: 0,
      },
    })
  }

  console.log(`Invoice paid: ${invoice.id}`)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (subscriptionId) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: { status: 'PAST_DUE' },
    })
  }

  console.log(`Invoice payment failed: ${invoice.id}`)
}

async function handleInvoiceFinalized(invoice: Stripe.Invoice) {
  console.log(`Invoice finalized: ${invoice.id}, total: ${invoice.total}`)
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log(`Trial ending soon for subscription: ${subscription.id}`)
}

// Helper functions

function mapPriceToPlan(priceId: string | undefined): 'FREE_TRIAL' | 'PAY_PER_CLAIM' | 'UNLIMITED_MONTHLY' | 'UNLIMITED_ANNUAL' {
  if (!priceId) return 'FREE_TRIAL'

  if (priceId === env.STRIPE_PRICE_PAY_PER_CLAIM) return 'PAY_PER_CLAIM'
  if (priceId === env.STRIPE_PRICE_UNLIMITED_MONTHLY) return 'UNLIMITED_MONTHLY'
  if (priceId === env.STRIPE_PRICE_UNLIMITED_ANNUAL) return 'UNLIMITED_ANNUAL'

  return 'FREE_TRIAL'
}

function mapStripeStatus(status: Stripe.Subscription.Status): 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' {
  switch (status) {
    case 'trialing':
      return 'TRIALING'
    case 'active':
      return 'ACTIVE'
    case 'past_due':
      return 'PAST_DUE'
    case 'canceled':
      return 'CANCELED'
    case 'unpaid':
      return 'UNPAID'
    default:
      return 'ACTIVE'
  }
}
