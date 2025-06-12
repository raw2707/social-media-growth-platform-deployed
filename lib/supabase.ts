import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
          role: 'customer' | 'admin' | 'affiliate'
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          role?: 'customer' | 'admin' | 'affiliate'
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          role?: 'customer' | 'admin' | 'affiliate'
        }
      }
      social_accounts: {
        Row: {
          id: string
          user_id: string
          platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
          handle: string
          followers_start: number
          current_followers: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
          handle: string
          followers_start?: number
          current_followers?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
          handle?: string
          followers_start?: number
          current_followers?: number
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          slug: string
          monthly_price: number
          yearly_price: number
          followers_per_month: number
          yearly_bonus_followers: number
          features: string[]
          is_popular: boolean
          is_active: boolean
          stripe_monthly_price_id: string | null
          stripe_yearly_price_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          monthly_price: number
          yearly_price: number
          followers_per_month: number
          yearly_bonus_followers?: number
          features: string[]
          is_popular?: boolean
          is_active?: boolean
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          monthly_price?: number
          yearly_price?: number
          followers_per_month?: number
          yearly_bonus_followers?: number
          features?: string[]
          is_popular?: boolean
          is_active?: boolean
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
          billing_cycle: 'monthly' | 'yearly'
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
          billing_cycle: 'monthly' | 'yearly'
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          platform?: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
          billing_cycle?: 'monthly' | 'yearly'
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      growth_reports: {
        Row: {
          id: string
          subscription_id: string
          report_date: string
          followers_gained: number
          engagement_rate: number | null
          impressions: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          report_date: string
          followers_gained?: number
          engagement_rate?: number | null
          impressions?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          report_date?: string
          followers_gained?: number
          engagement_rate?: number | null
          impressions?: number
          notes?: string | null
          created_at?: string
        }
      }
      affiliates: {
        Row: {
          id: string
          user_id: string
          referral_code: string
          commission_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          payment_method: 'paypal' | 'stripe' | 'bank' | 'wise'
          payment_details: Record<string, any>
          total_earnings: number
          monthly_referred_revenue: number
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          referral_code: string
          commission_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          payment_method: 'paypal' | 'stripe' | 'bank' | 'wise'
          payment_details: Record<string, any>
          total_earnings?: number
          monthly_referred_revenue?: number
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          referral_code?: string
          commission_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          payment_method?: 'paypal' | 'stripe' | 'bank' | 'wise'
          payment_details?: Record<string, any>
          total_earnings?: number
          monthly_referred_revenue?: number
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          affiliate_id: string
          referred_user_id: string
          subscription_id: string | null
          status: 'pending' | 'active' | 'completed' | 'canceled'
          commission_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          referred_user_id: string
          subscription_id?: string | null
          status: 'pending' | 'active' | 'completed' | 'canceled'
          commission_rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          affiliate_id?: string
          referred_user_id?: string
          subscription_id?: string | null
          status?: 'pending' | 'active' | 'completed' | 'canceled'
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          subtotal: number
          tax_amount: number
          discount_amount: number
          coupon_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          billing_details: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          subtotal: number
          tax_amount: number
          discount_amount?: number
          coupon_id?: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          billing_details?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          coupon_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          billing_details?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_percentage: number
          description: string | null
          max_uses: number | null
          current_uses: number
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_percentage: number
          description?: string | null
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_percentage?: number
          description?: string | null
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export default supabase

// Helper functions for common operations
export const supabaseHelpers = {
  // Authentication helpers
  async signUp(email: string, password: string, metadata?: { first_name?: string; last_name?: string }) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
  },

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  async signOut() {
    return await supabase.auth.signOut()
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getProfile(userId: string) {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  // Plans helpers
  async getActivePlans() {
    return await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('monthly_price')
  },

  async getPlanBySlug(slug: string) {
    return await supabase
      .from('plans')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
  },

  // Subscriptions helpers
  async getUserSubscriptions(userId: string) {
    return await supabase
      .from('subscriptions')
      .select(`
        *,
        plans (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async createSubscription(subscription: Database['public']['Tables']['subscriptions']['Insert']) {
    return await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single()
  },

  // Social accounts helpers
  async getUserSocialAccounts(userId: string) {
    return await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')
  },

  async addSocialAccount(account: Database['public']['Tables']['social_accounts']['Insert']) {
    return await supabase
      .from('social_accounts')
      .insert(account)
      .select()
      .single()
  },

  // Growth reports helpers
  async getGrowthReports(subscriptionId: string) {
    return await supabase
      .from('growth_reports')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .order('report_date', { ascending: false })
  },

  // Affiliate helpers
  async getAffiliateByUserId(userId: string) {
    return await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', userId)
      .single()
  },

  async createAffiliate(affiliate: Database['public']['Tables']['affiliates']['Insert']) {
    return await supabase
      .from('affiliates')
      .insert(affiliate)
      .select()
      .single()
  },

  // Coupon helpers
  async validateCoupon(code: string) {
    return await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single()
  },

  // Order helpers
  async createOrder(order: Database['public']['Tables']['orders']['Insert']) {
    return await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
  },

  async getUserOrders(userId: string) {
    return await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  }
}

// Export types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type SocialAccount = Database['public']['Tables']['social_accounts']['Row']
export type Plan = Database['public']['Tables']['plans']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type GrowthReport = Database['public']['Tables']['growth_reports']['Row']
export type Affiliate = Database['public']['Tables']['affiliates']['Row']
export type Referral = Database['public']['Tables']['referrals']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Coupon = Database['public']['Tables']['coupons']['Row']

// Platform types
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter'
export type BillingCycle = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused' 