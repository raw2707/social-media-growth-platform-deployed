import { NextRequest, NextResponse } from 'next/server'
import supabase, { supabaseHelpers } from '@/lib/supabase'

// GET /api/coupons?code=COUPON_CODE - Validate a coupon code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ 
        error: 'Missing coupon code parameter' 
      }, { status: 400 })
    }

    console.log(`🎟️  Validating coupon code: ${code}`)

    const { data: coupon, error } = await supabaseHelpers.validateCoupon(code)
    
    if (error || !coupon) {
      console.log(`❌ Invalid coupon code: ${code}`)
      return NextResponse.json({ 
        valid: false,
        error: 'Invalid or expired coupon code' 
      }, { status: 404 })
    }

    // Check if coupon has reached max uses
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      console.log(`❌ Coupon ${code} has reached maximum uses`)
      return NextResponse.json({ 
        valid: false,
        error: 'Coupon has reached maximum uses' 
      }, { status: 400 })
    }

    // Check if coupon has expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      console.log(`❌ Coupon ${code} has expired`)
      return NextResponse.json({ 
        valid: false,
        error: 'Coupon has expired' 
      }, { status: 400 })
    }

    console.log(`✅ Valid coupon: ${code} (${coupon.discount_percentage}% discount)`)
    
    return NextResponse.json({ 
      valid: true,
      coupon: {
        code: coupon.code,
        discount_percentage: coupon.discount_percentage,
        description: coupon.description,
        expires_at: coupon.expires_at,
        remaining_uses: coupon.max_uses ? coupon.max_uses - coupon.current_uses : null
      }
    })

  } catch (error: any) {
    console.error('❌ Coupon validation error:', error)
    return NextResponse.json({ 
      valid: false,
      error: 'Failed to validate coupon',
      details: error.message 
    }, { status: 500 })
  }
}

// POST /api/coupons - Apply a coupon (increment usage counter)
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ 
        error: 'Missing coupon code' 
      }, { status: 400 })
    }

    console.log(`🎟️  Applying coupon code: ${code}`)

    // Validate coupon first
    const { data: coupon, error } = await supabaseHelpers.validateCoupon(code)
    
    if (error || !coupon) {
      return NextResponse.json({ 
        error: 'Invalid coupon code' 
      }, { status: 404 })
    }

    // Check limits again
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json({ 
        error: 'Coupon has reached maximum uses' 
      }, { status: 400 })
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ 
        error: 'Coupon has expired' 
      }, { status: 400 })
    }

    // Increment usage counter
    const { error: updateError } = await supabase
      .from('coupons')
      .update({ 
        current_uses: coupon.current_uses + 1 
      })
      .eq('id', coupon.id)

    if (updateError) {
      console.error('❌ Failed to update coupon usage:', updateError)
      return NextResponse.json({ 
        error: 'Failed to apply coupon' 
      }, { status: 500 })
    }

    console.log(`✅ Coupon ${code} applied successfully`)
    
    return NextResponse.json({ 
      message: 'Coupon applied successfully',
      discount_percentage: coupon.discount_percentage
    })

  } catch (error: any) {
    console.error('❌ Coupon application error:', error)
    return NextResponse.json({ 
      error: 'Failed to apply coupon',
      details: error.message 
    }, { status: 500 })
  }
} 