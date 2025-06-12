-- Verification Script - Run this to check deployment
-- This will show you what was created

-- Check all tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check plans were inserted
SELECT 
  name,
  slug,
  monthly_price,
  yearly_price,
  is_popular
FROM public.plans 
ORDER BY monthly_price;

-- Check coupons were inserted  
SELECT 
  code,
  discount_percentage,
  description,
  max_uses,
  expires_at
FROM public.coupons 
ORDER BY discount_percentage DESC;

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Count total policies created
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename; 