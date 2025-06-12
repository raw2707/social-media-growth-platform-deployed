import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, getCommissionRate } from '@/lib/stripe'
import supabase, { supabaseHelpers } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('No Stripe signature found')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    const event = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    console.log(`🔥 Processing webhook: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event.data.object)
        break
      }

      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event.data.object)
        break
      }

      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event.data.object)
        break
      }

      case 'invoice.paid': {
        await handleInvoicePaid(event.data.object)
        break
      }

      case 'invoice.payment_failed': {
        await handleInvoicePaymentFailed(event.data.object)
        break
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ 
      error: error.message || 'Webhook processing failed' 
    }, { status: 400 })
  }
}

async function handleCheckoutCompleted(session: any) {
  const { userId, planId, platform, billingCycle } = session.metadata

  if (!userId || !planId || !platform || !billingCycle) {
    console.error('❌ Missing metadata in checkout session:', session.metadata)
    return
  }

  try {
    console.log(`✅ Processing checkout for user ${userId}, plan ${planId}`)

    // Calculate period end based on billing cycle
    const periodStart = new Date(session.created * 1000)
    const periodEnd = new Date(periodStart)
    
    if (billingCycle === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    // Create subscription in database
    const { data: subscription, error: subError } = await supabaseHelpers.createSubscription({
      user_id: userId,
      plan_id: planId,
      platform: platform,
      billing_cycle: billingCycle,
      stripe_subscription_id: session.subscription,
      stripe_customer_id: session.customer,
      status: 'active',
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString()
    })

    if (subError) {
      console.error('❌ Failed to create subscription:', subError)
      return
    }

    // Create order record
    const { error: orderError } = await supabase.from('orders').insert({
      user_id: userId,
      total_amount: session.amount_total,
      subtotal: session.amount_subtotal || session.amount_total,
      tax_amount: session.total_details?.amount_tax || 0,
      discount_amount: session.total_details?.amount_discount || 0,
      status: 'completed',
      stripe_payment_intent_id: session.payment_intent,
      billing_details: session.customer_details
    })

    if (orderError) {
      console.error('⚠️  Failed to create order record:', orderError)
    }

    // Handle affiliate referral if exists
    const { data: referral } = await supabase
      .from('referrals')
      .select(`
        *,
        affiliate:affiliates(*)
      `)
      .eq('referred_user_id', userId)
      .eq('status', 'pending')
      .single()

    if (referral?.affiliate) {
      console.log(`💰 Processing affiliate commission for ${referral.affiliate.referral_code}`)
      
      const commissionAmount = Math.round(
        session.amount_total * getCommissionRate(referral.affiliate.commission_tier)
      )

      // Update referral status
      await supabase
        .from('referrals')
        .update({
          status: 'active',
          subscription_id: session.subscription
        })
        .eq('id', referral.id)

      // Update affiliate earnings
      await supabase
        .from('affiliates')
        .update({
          total_earnings: referral.affiliate.total_earnings + commissionAmount,
          monthly_referred_revenue: referral.affiliate.monthly_referred_revenue + session.amount_total
        })
        .eq('id', referral.affiliate.id)

      console.log(`✅ Affiliate commission processed: $${(commissionAmount / 100).toFixed(2)}`)
    }

    console.log(`✅ Checkout completed successfully for user ${userId}`)

  } catch (error) {
    console.error('❌ Error handling checkout completion:', error)
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      })
      .eq('stripe_subscription_id', subscription.id)

    console.log(`✅ Subscription updated: ${subscription.id}`)
  } catch (error) {
    console.error('❌ Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)

    console.log(`✅ Subscription canceled: ${subscription.id}`)
  } catch (error) {
    console.error('❌ Error canceling subscription:', error)
  }
}

async function handleInvoicePaid(invoice: any) {
  try {
    await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('stripe_subscription_id', invoice.subscription)

    console.log(`✅ Invoice paid for subscription: ${invoice.subscription}`)
  } catch (error) {
    console.error('❌ Error handling invoice paid:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  try {
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('stripe_subscription_id', invoice.subscription)

    console.log(`⚠️  Payment failed for subscription: ${invoice.subscription}`)
  } catch (error) {
    console.error('❌ Error handling payment failure:', error)
  }
} 