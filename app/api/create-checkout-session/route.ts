import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json()

    // Get plan details - try Supabase first, fallback to mock data
    let plan;
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !planData) {
      // Fallback to mock plans if Supabase fails
      console.warn('⚠️ Supabase plan lookup failed, using mock data')
      const mockPlans = {
        'starter-plan': {
          id: 'starter-plan',
          name: 'Starter',
          monthly_price: 5900,
          yearly_price: 3540,
          description: 'Perfect for getting started with social media growth'
        },
        'pro-plan': {
          id: 'pro-plan', 
          name: 'Pro',
          monthly_price: 11900,
          yearly_price: 7140,
          description: 'Most popular plan for serious growth'
        },
        'enterprise-plan': {
          id: 'enterprise-plan',
          name: 'Enterprise', 
          monthly_price: 29900,
          yearly_price: 17940,
          description: 'For businesses that need maximum growth'
        }
      }
      
      plan = mockPlans[planId as keyof typeof mockPlans]
      if (!plan) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 }
        )
      }
    } else {
      plan = planData
    }

    // For now, use a mock user if no userId provided or user lookup fails
    let user = { email: 'customer@example.com' }
    if (userId) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (userData && !userError) {
        user = userData
      } else {
        console.warn('⚠️ User lookup failed, using mock customer email')
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
              images: ['https://your-domain.com/logo.png'], // Add your logo
            },
            unit_amount: plan.monthly_price, // Already in cents
                          recurring: {
                interval: 'month', // Default to monthly for now
              },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: userId,
          planId: planId,
        },
      },
      metadata: {
        userId: userId,
        planId: planId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      allow_promotion_codes: true,
    })

    // Save checkout session to database (skip if no userId)
    if (userId) {
      try {
        await supabase.from('orders').insert({
          user_id: userId,
          plan_id: planId,
          stripe_session_id: session.id,
          total_amount: plan.monthly_price,
          subtotal: plan.monthly_price,
          tax_amount: 0,
          discount_amount: 0,
          status: 'pending'
        })
      } catch (orderError) {
        console.warn('⚠️ Order creation failed:', orderError)
      }
    }

    console.log('✅ Checkout session created:', session.id)
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error: any) {
    console.error('❌ Checkout session error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 