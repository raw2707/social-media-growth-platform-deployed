-- Fixed Database Schema - Matches TypeScript types
-- This corrects the plans table structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing tables
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.affiliate_payments CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.affiliates CASCADE;
DROP TABLE IF EXISTS public.growth_reports CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.social_accounts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- ================================
-- CREATE CORRECTED TABLES
-- ================================

-- 1. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'affiliate'))
);

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Plans table (CORRECTED to match TypeScript types)
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  monthly_price INTEGER NOT NULL,
  yearly_price INTEGER NOT NULL,
  followers_per_month INTEGER NOT NULL,
  yearly_bonus_followers INTEGER DEFAULT 0,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stripe_monthly_price_id VARCHAR(255),
  stripe_yearly_price_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Social accounts table
CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter')),
  handle VARCHAR(100) NOT NULL,
  followers_start INTEGER DEFAULT 0,
  current_followers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform)
);

-- 4. Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter')),
  billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'paused')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Growth reports table
CREATE TABLE public.growth_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  followers_gained INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  impressions INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Affiliates table (CORRECTED to match TypeScript types)
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  commission_tier VARCHAR(20) DEFAULT 'bronze' CHECK (commission_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('paypal', 'stripe', 'bank', 'wise')),
  payment_details JSONB NOT NULL DEFAULT '{}',
  total_earnings INTEGER DEFAULT 0,
  monthly_referred_revenue INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Referrals table (CORRECTED to match TypeScript types)
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'canceled')),
  commission_rate DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Coupons table
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL,
  description TEXT,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  coupon_id UUID REFERENCES public.coupons(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id VARCHAR(255),
  billing_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- ENABLE RLS & SECURITY
-- ================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create basic security policies
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can manage own social accounts" ON public.social_accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own orders" ON public.orders
  FOR ALL USING (auth.uid() = user_id);

-- ================================
-- CREATE FUNCTIONS AND TRIGGERS
-- ================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================
-- INSERT CORRECTED SEED DATA
-- ================================

-- Insert subscription plans with correct structure
INSERT INTO public.plans (name, slug, monthly_price, yearly_price, followers_per_month, yearly_bonus_followers, features, is_popular) VALUES
(
  'Starter', 
  'starter', 
  5900,  -- $59/month
  3540,  -- $35.40/month when billed yearly
  1000,  -- 1000 followers per month
  2000,  -- 2000 bonus followers yearly
  ARRAY['1 social media account', 'Basic growth analytics', 'Email support', 'Monthly growth reports', 'Content suggestions'],
  false
),
(
  'Pro', 
  'pro', 
  11900, -- $119/month
  7140,  -- $71.40/month when billed yearly
  3000,  -- 3000 followers per month
  6000,  -- 6000 bonus followers yearly
  ARRAY['3 social media accounts', 'Advanced analytics', 'Priority support', 'Weekly growth reports', 'AI content optimization', 'Hashtag research'],
  true
),
(
  'Elite', 
  'elite', 
  18900, -- $189/month
  11340, -- $113.40/month when billed yearly
  5000,  -- 5000 followers per month
  10000, -- 10000 bonus followers yearly
  ARRAY['5 social media accounts', 'Premium analytics', '24/7 support', 'Daily growth reports', 'Custom growth strategy', 'Competitor analysis'],
  false
),
(
  'Ultimate', 
  'ultimate', 
  29900, -- $299/month
  17940, -- $179.40/month when billed yearly
  10000, -- 10000 followers per month
  20000, -- 20000 bonus followers yearly
  ARRAY['Unlimited accounts', 'Enterprise analytics', 'Dedicated account manager', 'Real-time reporting', 'Custom integrations', 'API access'],
  false
);

-- Insert sample coupons
INSERT INTO public.coupons (code, discount_percentage, description, max_uses, expires_at) VALUES
('LAUNCH50', 50, '50% off for early adopters', 100, '2024-12-31 23:59:59+00'),
('WELCOME25', 25, '25% off for new users', 1000, '2024-12-31 23:59:59+00'),
('SAVE20', 20, '20% discount on any plan', NULL, '2024-12-31 23:59:59+00'),
('STUDENT15', 15, 'Student discount', 500, '2024-12-31 23:59:59+00'),
('YEARLY30', 30, '30% off yearly subscriptions', NULL, '2024-12-31 23:59:59+00'); 