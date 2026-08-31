-- Debug Deep Research Table Access
-- Run this in Supabase Dashboard > SQL Editor to diagnose issues

-- 1. Check if table exists and its structure
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'deep_research_history'
ORDER BY ordinal_position;

-- 2. Check RLS status
SELECT 
  schemaname, 
  tablename, 
  rowsecurity, 
  relowner 
FROM pg_class 
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
WHERE relname = 'deep_research_history';

-- 3. Check all policies on the table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'deep_research_history';

-- 4. Test basic table access (this should work for admin/service role)
SELECT COUNT(*) as record_count FROM deep_research_history;

-- 5. Check if there are any existing records
SELECT 
  id,
  user_id,
  topic,
  LENGTH(report) as report_length,
  total_findings,
  max_depth,
  created_at
FROM deep_research_history 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Test JWT claim extraction (this shows what Clerk user ID would look like)
-- Note: This will only work when a Clerk JWT token is present
SELECT 
  auth.jwt() as jwt_payload,
  auth.jwt() ->> 'sub' as clerk_user_id,
  auth.uid() as supabase_auth_uid; 