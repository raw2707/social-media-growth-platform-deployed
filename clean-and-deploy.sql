-- Clean deployment: Drop existing tables and recreate
-- ⚠️ WARNING: This will delete all existing data!

-- Drop tables in reverse order (to handle foreign key constraints)
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

-- Now paste your entire database.sql content below this line
-- (Copy everything from lib/database.sql and paste it here) 