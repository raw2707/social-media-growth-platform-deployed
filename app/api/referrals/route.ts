import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

// POST /api/referrals - Track a referral when user signs up
export async function POST(request: NextRequest) {
  try {
    const { referralCode, newUserId } = await request.json()

    if (!referralCode || !newUserId) {
      return NextResponse.json({ 
        error: 'Missing required fields: referralCode, newUserId' 
      }, { status: 400 })
    }

    console.log(`🔗 Processing referral: ${referralCode} -> ${newUserId}`)

    // Check if referral code exists and is active
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id, user_id, referral_code, status, total_referrals')
      .eq('referral_code', referralCode)
      .eq('status', 'active')
      .single()

    if (affiliateError || !affiliate) {
      console.log(`❌ Invalid referral code: ${referralCode}`)
      return NextResponse.json({ 
        error: 'Invalid or inactive referral code' 
      }, { status: 404 })
    }

    // Prevent self-referral
    if (affiliate.user_id === newUserId) {
      console.log(`❌ Self-referral attempt: ${newUserId}`)
      return NextResponse.json({ 
        error: 'Cannot refer yourself' 
      }, { status: 400 })
    }

    // Check if user already has a referral record
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_user_id', newUserId)
      .single()

    if (existingReferral) {
      console.log(`❌ User ${newUserId} already has a referral record`)
      return NextResponse.json({ 
        error: 'User already has a referral record' 
      }, { status: 400 })
    }

    // Create referral record
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .insert({
        affiliate_id: affiliate.id,
        referred_user_id: newUserId,
        status: 'pending', // Will become 'active' when they subscribe
        referral_code: referralCode
      })
      .select()
      .single()

    if (referralError) {
      console.error('❌ Failed to create referral record:', referralError)
      return NextResponse.json({ 
        error: 'Failed to track referral',
        details: referralError.message 
      }, { status: 500 })
    }

    // Update affiliate stats
    await supabase
      .from('affiliates')
      .update({
        total_referrals: affiliate.total_referrals + 1
      })
      .eq('id', affiliate.id)

    console.log(`✅ Referral tracked: ${referralCode} -> ${newUserId}`)
    
    return NextResponse.json({ 
      message: 'Referral tracked successfully',
      referral: referral
    })

  } catch (error: any) {
    console.error('❌ Referral tracking error:', error)
    return NextResponse.json({ 
      error: 'Failed to process referral',
      details: error.message 
    }, { status: 500 })
  }
}

// GET /api/referrals?code=REFERRAL_CODE - Validate a referral code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ 
        error: 'Missing referral code parameter' 
      }, { status: 400 })
    }

    console.log(`🔗 Validating referral code: ${code}`)

    // Check if referral code exists and is active
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select(`
        id,
        user_id,
        referral_code,
        status,
        commission_tier,
        profiles:user_id(first_name, last_name)
      `)
      .eq('referral_code', code)
      .eq('status', 'active')
      .single()

    if (error || !affiliate) {
      console.log(`❌ Invalid referral code: ${code}`)
      return NextResponse.json({ 
        valid: false,
        error: 'Invalid or inactive referral code' 
      }, { status: 404 })
    }

    console.log(`✅ Valid referral code: ${code}`)
    
    return NextResponse.json({ 
      valid: true,
      affiliate: {
        referral_code: affiliate.referral_code,
        commission_tier: affiliate.commission_tier,
        affiliate_name: Array.isArray(affiliate.profiles) && affiliate.profiles[0]?.first_name
          ? `${affiliate.profiles[0].first_name} ${affiliate.profiles[0].last_name || ''}`.trim()
          : 'Partner'
      }
    })

  } catch (error: any) {
    console.error('❌ Referral validation error:', error)
    return NextResponse.json({ 
      valid: false,
      error: 'Failed to validate referral code',
      details: error.message 
    }, { status: 500 })
  }
} 