import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'SocialGrow',
    version: '1.0.0',
  },
})

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'] as const,
  billing_address_collection: 'required' as const,
  customer_creation: 'always' as const,
}

// Plan configurations that match your Supabase data
export const PLAN_CONFIGS = {
  starter: {
    name: 'Starter Plan',
    monthlyPrice: 5900, // $59.00
    yearlyPrice: 2950,  // $29.50 (yearly billing)
    followers: 1000,
    features: ['1,000 followers/month', 'Basic targeting', 'Email support', 'Monthly reports'],
  },
  pro: {
    name: 'Pro Plan',
    monthlyPrice: 11900, // $119.00
    yearlyPrice: 5950,   // $59.50 (yearly billing)
    followers: 2000,
    features: ['2,000 followers/month', 'Advanced targeting', 'Priority support', 'Weekly reports', 'Analytics dashboard'],
  },
  elite: {
    name: 'Elite Plan',
    monthlyPrice: 18900, // $189.00
    yearlyPrice: 9450,   // $94.50 (yearly billing)
    followers: 3500,
    features: ['3,500 followers/month', 'Premium targeting', '24/7 support', 'Daily reports', 'Custom strategy'],
  },
  ultimate: {
    name: 'Ultimate Plan',
    monthlyPrice: 29900, // $299.00
    yearlyPrice: 14950,  // $149.50 (yearly billing)
    followers: 5000,
    features: ['5,000 followers/month', 'Elite targeting', 'Dedicated manager', 'Real-time reports', 'Growth guarantee'],
  },
} as const

// Helper function to format price for display
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

// Helper function to calculate tax (you can customize this based on your needs)
export function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return Math.round(subtotal * taxRate)
}

// Helper function to calculate discount
export function calculateDiscount(subtotal: number, discountPercentage: number): number {
  return Math.round(subtotal * (discountPercentage / 100))
}

// Commission rates for affiliate tiers
export const COMMISSION_RATES = {
  bronze: 0.15,   // 15%
  silver: 0.20,   // 20%
  gold: 0.25,     // 25%
  platinum: 0.30, // 30%
} as const

// Helper function to get commission rate by tier
export function getCommissionRate(tier: keyof typeof COMMISSION_RATES): number {
  return COMMISSION_RATES[tier]
}

// Webhook event types we care about
export const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.created',
  'customer.updated',
] as const

export type WebhookEvent = typeof WEBHOOK_EVENTS[number]

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`)
  }
}

// Helper function to create or retrieve customer
export async function getOrCreateCustomer(
  email: string,
  name?: string,
  userId?: string
): Promise<Stripe.Customer> {
  // First, try to find existing customer by email
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    name,
    metadata: userId ? { userId } : {},
  })
}

// Helper function to create checkout session
export async function createCheckoutSession(params: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  discountCouponId?: string
}) {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: params.customerId,
    payment_method_types: STRIPE_CONFIG.payment_method_types,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    billing_address_collection: STRIPE_CONFIG.billing_address_collection,
    customer_creation: STRIPE_CONFIG.customer_creation,
    metadata: params.metadata,
  }

  // Add discount if provided
  if (params.discountCouponId) {
    sessionParams.discounts = [{ coupon: params.discountCouponId }]
  }

  return await stripe.checkout.sessions.create(sessionParams)
}

// Helper function to cancel subscription
export async function cancelSubscription(subscriptionId: string, immediately = false) {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId)
  } else {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
  }
}

// Helper function to reactivate subscription
export async function reactivateSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}

// Helper function to update subscription
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  })
}

// Helper function to create portal session for customer management
export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Helper function to get subscription details
export async function getSubscriptionDetails(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method', 'customer'],
  })
}

// Helper function to create refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
    reason,
  }

  if (amount) {
    refundParams.amount = amount
  }

  return await stripe.refunds.create(refundParams)
}

// Export default stripe instance
export default stripe 