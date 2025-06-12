-- Complete Database Deployment Script
-- This will drop existing tables and create everything fresh

-- ================================
-- STEP 1: CLEAN EXISTING TABLES
-- ================================

-- Drop existing tables (CASCADE removes dependencies)
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

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON public.social_accounts;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- ================================
-- STEP 2: CREATE FRESH SCHEMA
-- ================================

-- Now copy and paste your ENTIRE lib/database.sql content below this line: 