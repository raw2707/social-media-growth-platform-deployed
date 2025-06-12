-- Check existing tables in your Supabase database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if profiles table has data
SELECT COUNT(*) as profile_count FROM public.profiles; 