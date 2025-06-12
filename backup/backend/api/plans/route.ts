import { NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('📋 Fetching active plans...')
    
    const { data: plans, error } = await supabaseHelpers.getActivePlans()
    
    if (error) {
      console.error('❌ Plans fetch error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch plans',
        details: error.message 
      }, { status: 500 })
    }

    console.log(`✅ Found ${plans?.length || 0} active plans`)
    
    return NextResponse.json({ 
      plans: plans || [],
      count: plans?.length || 0
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