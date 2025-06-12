import { NextRequest, NextResponse } from 'next/server'
import supabase, { supabaseHelpers } from '@/lib/supabase'
import { cancelSubscription, reactivateSubscription } from '@/lib/stripe'

// GET /api/subscriptions - Get user's subscriptions
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    console.log(`📊 Fetching subscriptions for user ${user.id}`)

    const { data: subscriptions, error } = await supabaseHelpers.getUserSubscriptions(user.id)
    
    if (error) {
      console.error('❌ Subscriptions fetch error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch subscriptions',
        details: error.message 
      }, { status: 500 })
    }

    console.log(`✅ Found ${subscriptions?.length || 0} subscriptions`)
    
    return NextResponse.json({ 
      subscriptions: subscriptions || [],
      count: subscriptions?.length || 0
    })

  } catch (error: any) {
    console.error('❌ Subscriptions API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

// POST /api/subscriptions - Manage subscription operations
export async function POST(request: NextRequest) {
  try {
    const { action, subscriptionId } = await request.json()

    if (!action || !subscriptionId) {
      return NextResponse.json({ 
        error: 'Missing required fields: action, subscriptionId' 
      }, { status: 400 })
    }

    // Get authenticated user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Verify user owns this subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    console.log(`⚙️  Processing ${action} for subscription ${subscriptionId}`)

    switch (action) {
      case 'cancel': {
        if (!subscription.stripe_subscription_id) {
          return NextResponse.json({ error: 'No Stripe subscription ID found' }, { status: 400 })
        }

        // Cancel in Stripe (at period end)
        await cancelSubscription(subscription.stripe_subscription_id, false)
        
        // Update in database
        await supabase
          .from('subscriptions')
          .update({ cancel_at_period_end: true })
          .eq('id', subscriptionId)

        console.log(`✅ Subscription ${subscriptionId} will cancel at period end`)
        return NextResponse.json({ message: 'Subscription will cancel at period end' })
      }

      case 'cancel_immediately': {
        if (!subscription.stripe_subscription_id) {
          return NextResponse.json({ error: 'No Stripe subscription ID found' }, { status: 400 })
        }

        // Cancel immediately in Stripe
        await cancelSubscription(subscription.stripe_subscription_id, true)
        
        // Update in database
        await supabase
          .from('subscriptions')
          .update({ 
            status: 'canceled',
            cancel_at_period_end: false
          })
          .eq('id', subscriptionId)

        console.log(`✅ Subscription ${subscriptionId} canceled immediately`)
        return NextResponse.json({ message: 'Subscription canceled immediately' })
      }

      case 'reactivate': {
        if (!subscription.stripe_subscription_id) {
          return NextResponse.json({ error: 'No Stripe subscription ID found' }, { status: 400 })
        }

        // Reactivate in Stripe
        await reactivateSubscription(subscription.stripe_subscription_id)
        
        // Update in database
        await supabase
          .from('subscriptions')
          .update({ cancel_at_period_end: false })
          .eq('id', subscriptionId)

        console.log(`✅ Subscription ${subscriptionId} reactivated`)
        return NextResponse.json({ message: 'Subscription reactivated' })
      }

      default:
        return NextResponse.json({ 
          error: `Unknown action: ${action}. Valid actions: cancel, cancel_immediately, reactivate` 
        }, { status: 400 })
    }

  } catch (error: any) {
    console.error('❌ Subscription management error:', error)
    return NextResponse.json({ 
      error: 'Failed to process subscription action',
      details: error.message 
    }, { status: 500 })
  }
} 