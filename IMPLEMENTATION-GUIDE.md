# SocialGrow Backend Implementation Guide
## Analysis of v0 Recommendations & Supabase Adaptation

This guide provides a comprehensive analysis of the v0 backend recommendations and how to implement them using your existing Supabase setup.

## 📊 V0 Analysis Summary

### ✅ **Excellent Recommendations from v0:**
1. **Database Schema Design** - Well-structured, comprehensive
2. **Stripe Integration Strategy** - Production-ready approach
3. **Authentication Flow** - Secure and scalable
4. **Affiliate System Design** - Complete commission tracking
5. **Order & Subscription Management** - Robust lifecycle handling

### 🔄 **Adaptations Made for Supabase:**
1. **Authentication**: Using Supabase Auth instead of NextAuth.js
2. **Database**: Leveraging Supabase PostgreSQL with RLS policies
3. **Real-time**: Utilizing Supabase real-time subscriptions
4. **Storage**: Can use Supabase Storage for any file needs
5. **Edge Functions**: Option to use Supabase Edge Functions for serverless

## 🚀 Implementation Roadmap

### Phase 1: Database Setup (Day 1-2)
**Priority: CRITICAL**

#### Step 1.1: Set Up Database Schema
```sql
-- Copy and run the complete SQL from lib/database.sql in your Supabase SQL Editor
-- This creates all tables, policies, triggers, and seed data
```

#### Step 1.2: Configure Environment Variables
```bash
# Copy env.example to .env.local
cp env.example .env.local

# Update with your actual values:
# - Supabase Service Role Key (from Supabase Dashboard)
# - Stripe Keys (from Stripe Dashboard)
# - Other API keys as needed
```

#### Step 1.3: Test Database Connection
```bash
npm run dev
# Visit your app and check if plans load from database
```

### Phase 2: Authentication Integration (Day 3-4)
**Priority: HIGH**

#### Step 2.1: Update Auth Modal Component
```typescript
// Update components/auth-modal.tsx to use Supabase Auth
import { supabaseHelpers } from '@/lib/supabase'

// Replace form handlers with:
const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
  const { data, error } = await supabaseHelpers.signUp(email, password, {
    first_name: firstName,
    last_name: lastName
  })
  
  if (error) {
    // Handle error
    console.error('Sign up error:', error.message)
    return
  }
  
  // Handle success - user will receive confirmation email
  console.log('Sign up successful, check email for confirmation')
}

const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await supabaseHelpers.signIn(email, password)
  
  if (error) {
    // Handle error
    console.error('Sign in error:', error.message)
    return
  }
  
  // Handle success - user is now logged in
  console.log('Sign in successful')
  onClose() // Close modal
}
```

#### Step 2.2: Create Auth Context Provider
```typescript
// Create providers/auth-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import supabase, { supabaseHelpers, type Profile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabaseHelpers.getProfile(userId)
    if (!error && data) {
      setProfile(data)
    }
  }

  const signOut = async () => {
    await supabaseHelpers.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

#### Step 2.3: Wrap App with Auth Provider
```typescript
// Update app/layout.tsx
import { AuthProvider } from '@/providers/auth-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Phase 3: Stripe Integration (Day 5-7)
**Priority: HIGH**

#### Step 3.1: Set Up Stripe Products and Prices
```bash
# Create a script to set up Stripe products
# Run this once to create your products in Stripe Dashboard
```

```typescript
// scripts/setup-stripe-products.ts
import { stripe, PLAN_CONFIGS } from '@/lib/stripe'

async function setupStripeProducts() {
  for (const [planKey, config] of Object.entries(PLAN_CONFIGS)) {
    console.log(`Creating product for ${config.name}...`)
    
    // Create product
    const product = await stripe.products.create({
      name: config.name,
      description: `${config.followers} followers/month - ${config.features.join(', ')}`,
      metadata: { planSlug: planKey }
    })

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: config.monthlyPrice,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { planSlug: planKey, billingCycle: 'monthly' }
    })

    // Create yearly price
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: config.yearlyPrice * 12, // Total yearly amount
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { planSlug: planKey, billingCycle: 'yearly' }
    })

    // Update your Supabase plans table with Stripe price IDs
    // You'll need to run this manually or create a separate script
    console.log(`${config.name} created:`)
    console.log(`Monthly Price ID: ${monthlyPrice.id}`)
    console.log(`Yearly Price ID: ${yearlyPrice.id}`)
  }
}

setupStripeProducts().catch(console.error)
```

#### Step 3.2: Create Checkout API Route
```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/stripe'
import supabase, { supabaseHelpers } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { planSlug, billingCycle, platform, couponCode } = await request.json()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseHelpers.getProfile(user.id)
    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get plan details
    const { data: plan, error: planError } = await supabaseHelpers.getPlanBySlug(planSlug)
    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      profile.email,
      `${profile.first_name} ${profile.last_name}`,
      user.id
    )

    // Update profile with Stripe customer ID if not exists
    if (!profile.stripe_customer_id) {
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id)
    }

    // Get the appropriate price ID
    const priceId = billingCycle === 'yearly' 
      ? plan.stripe_yearly_price_id 
      : plan.stripe_monthly_price_id

    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 })
    }

    // Validate coupon if provided
    let discountCouponId: string | undefined
    if (couponCode) {
      const { data: coupon } = await supabaseHelpers.validateCoupon(couponCode)
      if (coupon) {
        discountCouponId = couponCode
      }
    }

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancelled`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        platform,
        billingCycle
      },
      discountCouponId
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

#### Step 3.3: Create Webhook Handler
```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, getCommissionRate } from '@/lib/stripe'
import supabase, { supabaseHelpers } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    const event = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const { userId, planId, platform, billingCycle } = session.metadata

        // Create subscription in database
        await supabaseHelpers.createSubscription({
          user_id: userId,
          plan_id: planId,
          platform: platform as any,
          billing_cycle: billingCycle as any,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          status: 'active',
          current_period_start: new Date(session.created * 1000).toISOString(),
          current_period_end: new Date(
            session.created * 1000 + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
          ).toISOString()
        })

        // Handle affiliate referral if exists
        const { data: referral } = await supabase
          .from('referrals')
          .select(`
            *,
            affiliate:affiliates(*)
          `)
          .eq('referred_user_id', userId)
          .eq('status', 'pending')
          .single()

        if (referral && referral.affiliate) {
          // Calculate commission
          const commissionAmount = Math.round(
            session.amount_total * getCommissionRate(referral.affiliate.commission_tier)
          )

          // Update referral
          await supabase
            .from('referrals')
            .update({
              status: 'active',
              subscription_id: session.subscription
            })
            .eq('id', referral.id)

          // Update affiliate earnings
          await supabase
            .from('affiliates')
            .update({
              total_earnings: referral.affiliate.total_earnings + commissionAmount,
              monthly_referred_revenue: referral.affiliate.monthly_referred_revenue + session.amount_total
            })
            .eq('id', referral.affiliate.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

### Phase 4: Frontend Integration (Day 8-10)
**Priority: MEDIUM**

#### Step 4.1: Update Pricing Section
```typescript
// Update components/pricing-section.tsx to use real data
import { useEffect, useState } from 'react'
import { supabaseHelpers, type Plan } from '@/lib/supabase'

export default function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlans() {
      const { data, error } = await supabaseHelpers.getActivePlans()
      if (!error && data) {
        setPlans(data)
      }
      setLoading(false)
    }
    loadPlans()
  }, [])

  if (loading) return <div>Loading plans...</div>

  // Rest of your pricing component using real plan data
}
```

#### Step 4.2: Update Checkout Flow
```typescript
// Update components/checkout-cart.tsx
import { useAuth } from '@/providers/auth-provider'

const handleCheckout = async () => {
  if (!user) {
    // Redirect to auth modal
    return
  }

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planSlug: selectedPlan.slug,
        billingCycle: selectedBillingCycle,
        platform: selectedPlatform,
        couponCode: appliedCoupon?.code
      })
    })

    const { url, error } = await response.json()
    
    if (error) {
      console.error('Checkout error:', error)
      return
    }

    // Redirect to Stripe Checkout
    window.location.href = url
  } catch (error) {
    console.error('Checkout failed:', error)
  }
}
```

### Phase 5: Dashboard & Analytics (Day 11-12)
**Priority: MEDIUM**

#### Step 5.1: Create User Dashboard
```typescript
// Create app/dashboard/page.tsx
import { useAuth } from '@/providers/auth-provider'
import { useEffect, useState } from 'react'
import { supabaseHelpers } from '@/lib/supabase'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [socialAccounts, setSocialAccounts] = useState([])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    const [subsResult, socialResult] = await Promise.all([
      supabaseHelpers.getUserSubscriptions(user.id),
      supabaseHelpers.getUserSocialAccounts(user.id)
    ])

    if (subsResult.data) setSubscriptions(subsResult.data)
    if (socialResult.data) setSocialAccounts(socialResult.data)
  }

  // Dashboard UI implementation
}
```

### Phase 6: Affiliate System (Day 13-14)
**Priority: LOW**

#### Step 6.1: Create Affiliate Registration
```typescript
// Create app/affiliate/signup/page.tsx
import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { supabaseHelpers } from '@/lib/supabase'

export default function AffiliateSignup() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    paymentMethod: 'paypal',
    paymentDetails: {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    // Generate unique referral code
    const referralCode = `REF${user.id.slice(0, 8).toUpperCase()}`

    try {
      await supabaseHelpers.createAffiliate({
        user_id: user.id,
        referral_code: referralCode,
        payment_method: formData.paymentMethod as any,
        payment_details: formData.paymentDetails
      })

      // Success handling
    } catch (error) {
      console.error('Affiliate signup error:', error)
    }
  }

  // Form implementation
}
```

## 🔧 Additional Implementation Notes

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_social_accounts_user_platform ON public.social_accounts(user_id, platform);
CREATE INDEX idx_growth_reports_subscription_date ON public.growth_reports(subscription_id, report_date);
CREATE INDEX idx_referrals_affiliate_status ON public.referrals(affiliate_id, status);
```

### Real-time Subscriptions
```typescript
// Add real-time updates for live stats
useEffect(() => {
  const subscription = supabase
    .from('growth_reports')
    .on('INSERT', payload => {
      // Update live stats in real-time
      updateLiveStats(payload.new)
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

### Error Handling & Monitoring
- Implement comprehensive error logging
- Set up Sentry or similar error tracking
- Add health check endpoints
- Monitor database performance
- Track key business metrics

### Security Considerations
- All API routes should validate user authentication
- Use Supabase RLS policies for data security
- Validate all input data
- Implement rate limiting for API endpoints
- Store sensitive data (API keys) in environment variables

## 📋 Testing Checklist

- [ ] Database schema created successfully
- [ ] All RLS policies working correctly
- [ ] User registration and login flow
- [ ] Plan selection and checkout process
- [ ] Stripe webhook handling
- [ ] Subscription management
- [ ] Dashboard data loading
- [ ] Affiliate system functionality
- [ ] Real-time updates working
- [ ] Error handling and edge cases

## 🚀 Deployment Checklist

### Staging Environment
- [ ] Deploy to Vercel staging
- [ ] Configure environment variables
- [ ] Test Stripe webhooks with ngrok
- [ ] Verify database connections
- [ ] Test complete user journeys

### Production Environment
- [ ] Set up production Supabase project
- [ ] Configure production Stripe account
- [ ] Set up domain and SSL
- [ ] Configure production environment variables
- [ ] Set up monitoring and alerts
- [ ] Create backup strategies

This implementation guide provides a complete roadmap for building your SocialGrow backend using the excellent v0 recommendations, adapted specifically for your Supabase setup. The approach leverages the best of both worlds: v0's solid architecture with Supabase's powerful features. 