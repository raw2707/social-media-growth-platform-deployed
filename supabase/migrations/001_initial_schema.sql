-- SocialGrow Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Users Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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

-- Social Accounts Table
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

-- Plans Table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  monthly_price INTEGER NOT NULL, -- in cents
  yearly_price INTEGER NOT NULL, -- in cents
  followers_per_month INTEGER NOT NULL,
  yearly_bonus_followers INTEGER DEFAULT 0,
  features JSONB NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stripe_monthly_price_id VARCHAR(255),
  stripe_yearly_price_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions Table
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

-- Growth Reports Table
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

-- Affiliate Table
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  commission_tier VARCHAR(20) DEFAULT 'bronze' CHECK (commission_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('paypal', 'stripe', 'bank', 'wise')),
  payment_details JSONB NOT NULL,
  total_earnings INTEGER DEFAULT 0, -- in cents
  monthly_referred_revenue INTEGER DEFAULT 0, -- in cents
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Referrals Table
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

-- Affiliate Payments Table
CREATE TABLE public.affiliate_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in cents
  payment_method VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Coupons Table
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

-- Orders Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL, -- in cents
  subtotal INTEGER NOT NULL, -- in cents
  tax_amount INTEGER NOT NULL, -- in cents
  discount_amount INTEGER DEFAULT 0, -- in cents
  coupon_id UUID REFERENCES public.coupons(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id VARCHAR(255),
  billing_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter')),
  billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- in cents
  total_price INTEGER NOT NULL, -- in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- ROW LEVEL SECURITY POLICIES
-- ================================

-- Enable RLS on all tables
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
-- FUNCTIONS AND TRIGGERS
-- ================================

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

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ================================
-- SEED DATA
-- ================================

-- Insert initial plans
INSERT INTO public.plans (name, slug, monthly_price, yearly_price, followers_per_month, yearly_bonus_followers, features, is_popular) VALUES
('Starter Plan', 'starter', 5900, 2950, 1000, 500, '["1,000 followers/month", "Basic targeting", "Email support", "Monthly reports"]', false),
('Pro Plan', 'pro', 11900, 5950, 2000, 500, '["2,000 followers/month", "Advanced targeting", "Priority support", "Weekly reports", "Analytics dashboard"]', true),
('Elite Plan', 'elite', 18900, 9450, 3500, 500, '["3,500 followers/month", "Premium targeting", "24/7 support", "Daily reports", "Custom strategy"]', false),
('Ultimate Plan', 'ultimate', 29900, 14950, 5000, 500, '["5,000 followers/month", "Elite targeting", "Dedicated manager", "Real-time reports", "Growth guarantee"]', false);

-- Insert sample coupons
INSERT INTO public.coupons (code, discount_percentage, description, max_uses) VALUES
('WELCOME50', 50, 'Welcome discount for new users', 1000),
('SAVE25', 25, 'General discount code', NULL),
('BLACKFRIDAY', 40, 'Black Friday special', 500); 