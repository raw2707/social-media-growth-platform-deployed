// Simple test script to debug Supabase connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rfwnmztxsjjeoaffdhkk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd25tenR4c2pqZW9hZmZkaGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTA0MzcsImV4cCI6MjA2NDM2NjQzN30.B0is894Zicf9knrmvDYxItwX8m_u9XUKINkcyOkycXc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
    
    if (error) {
      console.error('❌ Supabase Error:', error)
      return
    }
    
    console.log('✅ Connection successful!')
    console.log(`📊 Found ${data?.length || 0} plans:`)
    data?.forEach(plan => {
      console.log(`  - ${plan.name}: $${plan.monthly_price/100}/month`)
    })
    
  } catch (err) {
    console.error('❌ Test failed:', err.message)
  }
}

testConnection() 