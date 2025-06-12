-- Simple and Robust Database Deployment
-- This version handles cleanup more gracefully

-- Enable UUID extension first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Simple cleanup - drop tables only (CASCADE will handle triggers)
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

-- Drop functions (if they exist)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- ================================
-- CREATE ALL TABLES
-- ================================

-- 1. Profiles table (extends Supabase auth.users)
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

-- Add foreign key to auth.users
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  monthly_price INTEGER NOT NULL,
  yearly_price INTEGER NOT NULL,
  features JSONB NOT NULL,
  max_accounts INTEGER DEFAULT 1,
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

-- 6. Affiliates table
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  commission_tier VARCHAR(20) DEFAULT 'basic' CHECK (commission_tier IN ('basic', 'premium', 'elite')),
  payment_email VARCHAR(255) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('paypal', 'stripe', 'bank_transfer', 'wise')),
  total_earnings INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  monthly_referred_revenue INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'canceled')),
  commission_earned INTEGER DEFAULT 0,
  referral_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Affiliate payments table
CREATE TABLE public.affiliate_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Coupons table
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

-- 10. Orders table
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

-- 11. Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter')),
  billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- ENABLE ROW LEVEL SECURITY
-- ================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ================================
-- CREATE SECURITY POLICIES
-- ================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Social accounts policies
CREATE POLICY "Users can manage own social accounts" ON public.social_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Plans policies (public read access)
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (is_active = true);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Growth reports policies
CREATE POLICY "Users can view own growth reports" ON public.growth_reports
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.subscriptions 
      WHERE id = growth_reports.subscription_id
    )
  );

-- Affiliates policies
CREATE POLICY "Users can view own affiliate data" ON public.affiliates
  FOR ALL USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Affiliates can view own referrals" ON public.referrals
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.affiliates 
      WHERE id = referrals.affiliate_id
    )
  );

-- Affiliate payments policies
CREATE POLICY "Affiliates can view own payments" ON public.affiliate_payments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.affiliates 
      WHERE id = affiliate_payments.affiliate_id
    )
  );

-- Coupons policies (public read for validation)
CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR ALL USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.orders 
      WHERE id = order_items.order_id
    )
  );

-- ================================
-- CREATE FUNCTIONS AND TRIGGERS
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
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

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================
-- INSERT SEED DATA
-- ================================

-- Insert subscription plans
INSERT INTO public.plans (name, slug, description, monthly_price, yearly_price, features, max_accounts, is_popular) VALUES
(
  'Starter', 
  'starter', 
  'Perfect for beginners starting their social media journey',
  5900,
  3540,
  '["1 social media account", "Basic growth analytics", "Email support", "Monthly growth reports", "Content suggestions"]',
  1,
  false
),
(
  'Pro', 
  'pro', 
  'Advanced features for serious content creators',
  11900,
  7140,
  '["3 social media accounts", "Advanced analytics", "Priority support", "Weekly growth reports", "AI content optimization", "Hashtag research"]',
  3,
  true
),
(
  'Elite', 
  'elite', 
  'Premium tools for influencers and businesses',
  18900,
  11340,
  '["5 social media accounts", "Premium analytics", "24/7 support", "Daily growth reports", "Custom growth strategy", "Competitor analysis", "Brand collaboration tools"]',
  5,
  false
),
(
  'Ultimate', 
  'ultimate', 
  'Everything you need to dominate social media',
  29900,
  17940,
  '["Unlimited accounts", "Enterprise analytics", "Dedicated account manager", "Real-time reporting", "Custom integrations", "API access", "White-label options"]',
  999,
  false
);

-- Insert sample coupons
INSERT INTO public.coupons (code, discount_percentage, description, max_uses, expires_at) VALUES
('LAUNCH50', 50, '50% off for early adopters', 100, '2024-12-31 23:59:59+00'),
('WELCOME25', 25, '25% off for new users', 1000, '2024-12-31 23:59:59+00'),
('SAVE20', 20, '20% discount on any plan', NULL, '2024-12-31 23:59:59+00'),
('STUDENT15', 15, 'Student discount', 500, '2024-12-31 23:59:59+00'),
('YEARLY30', 30, '30% off yearly subscriptions', NULL, '2024-12-31 23:59:59+00'); 