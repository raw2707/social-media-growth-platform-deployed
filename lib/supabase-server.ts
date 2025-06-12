import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client with service role (bypasses RLS)
const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

export default supabaseServer

// Server-side helper functions
export const supabaseServerHelpers = {
  // Plans helpers
  async getActivePlans() {
    return await supabaseServer
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('monthly_price')
  },

  async getPlanBySlug(slug: string) {
    return await supabaseServer
      .from('plans')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
  },

  // Profile helpers
  async getProfile(userId: string) {
    return await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  async createProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
    return await supabaseServer
      .from('profiles')
      .insert(profile)
      .select()
      .single()
  },

  // Subscription helpers
  async getUserSubscriptions(userId: string) {
    return await supabaseServer
      .from('subscriptions')
      .select(`
        *,
        plans (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async createSubscription(subscription: Database['public']['Tables']['subscriptions']['Insert']) {
    return await supabaseServer
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single()
  },

  // Order helpers
  async createOrder(order: Database['public']['Tables']['orders']['Insert']) {
    return await supabaseServer
      .from('orders')
      .insert(order)
      .select()
      .single()
  },

  async getUserOrders(userId: string) {
    return await supabaseServer
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  }
} 