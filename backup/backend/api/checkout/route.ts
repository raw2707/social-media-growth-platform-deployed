import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, getOrCreateCustomer, stripe } from '@/lib/stripe'
import supabase, { supabaseHelpers } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { planSlug, billingCycle, platform, couponCode } = await request.json()

    // Validate required fields
    if (!planSlug || !billingCycle || !platform) {
      return NextResponse.json({ 
        error: 'Missing required fields: planSlug, billingCycle, platform' 
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

    // Get user profile
    const { data: profile, error: profileError } = await supabaseHelpers.getProfile(user.id)
    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get plan details from database
    const { data: plan, error: planError } = await supabaseHelpers.getPlanBySlug(planSlug)
    if (planError || !plan) {
      return NextResponse.json({ error: `Plan '${planSlug}' not found` }, { status: 404 })
    }

    // Get the appropriate price ID
    const priceId = billingCycle === 'yearly' 
      ? plan.stripe_yearly_price_id 
      : plan.stripe_monthly_price_id

    if (!priceId) {
      return NextResponse.json({ 
        error: `${billingCycle} price not configured for plan ${planSlug}` 
      }, { status: 500 })
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      profile.email,
      `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      user.id
    )

    // Update profile with Stripe customer ID if not exists
    if (!profile.stripe_customer_id) {
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id)
    }

    // Validate coupon if provided
    let discountCouponId: string | undefined
    if (couponCode) {
      const { data: coupon, error: couponError } = await supabaseHelpers.validateCoupon(couponCode)
      if (!couponError && coupon) {
        // Create or get Stripe coupon
        try {
          await stripe.coupons.retrieve(couponCode)
          discountCouponId = couponCode
        } catch {
          // Create coupon in Stripe if doesn't exist
          await stripe.coupons.create({
            id: couponCode,
            percent_off: coupon.discount_percentage,
            duration: 'once'
          })
          discountCouponId = couponCode
        }
      }
    }

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancelled`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        platform,
        billingCycle
      },
      discountCouponId
    })

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
} 