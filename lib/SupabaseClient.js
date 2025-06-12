// This file is deprecated - use lib/supabase.ts instead
// Keeping for backward compatibility

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rfwnmztxsjjeoaffdhkk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd25tenR4c2pqZW9hZmZkaGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTA0MzcsImV4cCI6MjA2NDM2NjQzN30.B0is894Zicf9knrmvDYxItwX8m_u9XUKINkcyOkycXc'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
