import { NextRequest, NextResponse } from 'next/server'
import supabase, { supabaseHelpers } from '@/lib/supabase'

// GET /api/affiliates - Get user's affiliate data
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

    console.log(`👥 Fetching affiliate data for user ${user.id}`)

    // Get affiliate data
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select(`
        *,
        referrals(
          id,
          referred_user_id,
          status,
          commission_earned,
          created_at,
          profiles:referred_user_id(first_name, last_name, email)
        )
      `)
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Affiliate fetch error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch affiliate data',
        details: error.message 
      }, { status: 500 })
    }

    if (!affiliate) {
      console.log(`ℹ️  User ${user.id} is not an affiliate`)
      return NextResponse.json({ 
        isAffiliate: false,
        affiliate: null
      })
    }

    console.log(`✅ Found affiliate data for ${affiliate.referral_code}`)
    
    return NextResponse.json({ 
      isAffiliate: true,
      affiliate: affiliate
    })

  } catch (error: any) {
    console.error('❌ Affiliate API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

// POST /api/affiliates - Register as an affiliate or update settings
export async function POST(request: NextRequest) {
  try {
    const { action, paymentEmail, paymentMethod } = await request.json()

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

    console.log(`👥 Processing affiliate ${action} for user ${user.id}`)

    if (action === 'register') {
      // Check if already an affiliate
      const { data: existingAffiliate } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingAffiliate) {
        return NextResponse.json({ 
          error: 'Already registered as an affiliate' 
        }, { status: 400 })
      }

      // Generate unique referral code
      const baseCode = profile.first_name 
        ? `${profile.first_name.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        : `USER${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      let referralCode = baseCode
      let attempts = 0
      
      // Ensure referral code is unique
      while (attempts < 10) {
        const { data: existing } = await supabase
          .from('affiliates')
          .select('id')
          .eq('referral_code', referralCode)
          .single()

        if (!existing) break
        
        referralCode = `${baseCode}${attempts + 1}`
        attempts++
      }

      // Create affiliate record
      const { data: newAffiliate, error: createError } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          referral_code: referralCode,
          commission_tier: 'basic', // 15% commission
          payment_email: paymentEmail || profile.email,
          payment_method: paymentMethod || 'paypal',
          status: 'active'
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Failed to create affiliate:', createError)
        return NextResponse.json({ 
          error: 'Failed to register as affiliate',
          details: createError.message 
        }, { status: 500 })
      }

      console.log(`✅ Affiliate registered: ${referralCode}`)
      return NextResponse.json({ 
        message: 'Successfully registered as affiliate',
        affiliate: newAffiliate
      })

    } else if (action === 'update') {
      // Update affiliate settings
      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          payment_email: paymentEmail,
          payment_method: paymentMethod
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('❌ Failed to update affiliate:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update affiliate settings',
          details: updateError.message 
        }, { status: 500 })
      }

      console.log(`✅ Affiliate settings updated for user ${user.id}`)
      return NextResponse.json({ 
        message: 'Affiliate settings updated successfully'
      })

    } else {
      return NextResponse.json({ 
        error: `Unknown action: ${action}. Valid actions: register, update` 
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error('❌ Affiliate registration error:', error)
    return NextResponse.json({ 
      error: 'Failed to process affiliate request',
      details: error.message 
    }, { status: 500 })
  }
} 