-- Check Current RLS Policies Status
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Check all tables and their RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_class 
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
WHERE relname IN ('roadmaps', 'learning_paths', 'deep_research_history')
ORDER BY tablename;

-- 2. Check all policies for each table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation,
  qual as using_condition,
  with_check as with_check_condition
FROM pg_policies 
WHERE tablename IN ('roadmaps', 'learning_paths', 'deep_research_history')
ORDER BY tablename, cmd, policyname;

-- 3. Check if deep_research_history table exists and its structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'deep_research_history'
ORDER BY ordinal_position;

-- 4. Test JWT extraction (this shows what Clerk user ID looks like)
SELECT 
  'JWT Test' as test_type,
  auth.jwt() as full_jwt,
  auth.jwt() ->> 'sub' as clerk_user_id,
  auth.uid() as supabase_auth_uid;

-- 5. Check for any records in each table (as admin)
SELECT 'roadmaps' as table_name, COUNT(*) as record_count FROM roadmaps
UNION ALL
SELECT 'learning_paths' as table_name, COUNT(*) as record_count FROM learning_paths  
UNION ALL
SELECT 'deep_research_history' as table_name, COUNT(*) as record_count FROM deep_research_history; 