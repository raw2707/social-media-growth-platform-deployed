import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    try {
      console.log('🔐 Processing auth callback...')
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Auth callback error:', error)
        return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error.message)}`, request.url))
      }

      console.log('✅ Auth callback successful')
      
      // Redirect to the intended page or dashboard
      return NextResponse.redirect(new URL(next, request.url))
      
    } catch (error: any) {
      console.error('❌ Auth callback exception:', error)
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent('Authentication failed')}`, request.url))
    }
  }

  // No code provided, redirect to home
  console.log('⚠️  No auth code provided')
  return NextResponse.redirect(new URL('/?error=missing_code', request.url))
} 