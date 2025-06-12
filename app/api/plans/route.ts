import { NextResponse } from 'next/server'
import { supabaseServerHelpers } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('📋 Fetching active plans from Supabase (server-side)...')
    
    const { data: plans, error } = await supabaseServerHelpers.getActivePlans()
    
    if (error) {
      console.warn('⚠️ Supabase connection failed, using mock data:', error.message)
      
      // Fallback to mock data for development
      const mockPlans = [
        {
          id: 'starter-plan',
          name: 'Starter',
          slug: 'starter',
          monthly_price: 5900, // $59.00 in cents
          yearly_price: 3540, // $35.40 in cents (40% off)
          followers_per_month: 1000,
          yearly_bonus_followers: 2000,
          features: ['1 social media account', 'Basic growth analytics', 'Email support', 'Monthly growth reports'],
          is_popular: false,
          is_active: true,
          stripe_monthly_price_id: null,
          stripe_yearly_price_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'pro-plan',
          name: 'Pro',
          slug: 'pro',
          monthly_price: 11900, // $119.00 in cents
          yearly_price: 7140, // $71.40 in cents (40% off)
          followers_per_month: 3000,
          yearly_bonus_followers: 6000,
          features: ['3 social media accounts', 'Advanced analytics', 'Priority support', 'Weekly reports', 'Custom hashtags'],
          is_popular: true,
          is_active: true,
          stripe_monthly_price_id: null,
          stripe_yearly_price_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'enterprise-plan',
          name: 'Enterprise',
          slug: 'enterprise',
          monthly_price: 29900, // $299.00 in cents
          yearly_price: 17940, // $179.40 in cents (40% off)
          followers_per_month: 10000,
          yearly_bonus_followers: 20000,
          features: ['Unlimited accounts', 'Custom analytics', '24/7 support', 'Daily reports', 'Dedicated manager', 'Custom strategies'],
          is_popular: false,
          is_active: true,
          stripe_monthly_price_id: null,
          stripe_yearly_price_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      console.log(`✅ Using ${mockPlans.length} mock plans (database connection failed)`)
      
      return NextResponse.json({ 
        plans: mockPlans,
        count: mockPlans.length,
        source: 'mock_data',
        note: 'Using mock data due to database connection issues'
      })
    }

    console.log(`✅ Found ${plans?.length || 0} active plans from database`)
    
    return NextResponse.json({ 
      plans: plans || [],
      count: plans?.length || 0,
      source: 'database'
    })

  } catch (error: any) {
    console.error('❌ Plans API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

// Optional: Add a specific plan endpoint
export async function POST() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use GET to fetch plans.' 
  }, { status: 405 })
} 