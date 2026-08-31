-- DEBUG SCRIPT for Clerk Authentication Issues
-- Run this AFTER the comprehensive fix to debug any remaining issues

-- Check current session and JWT details
SELECT 
  'Current Session Debug' as section,
  auth.jwt() as full_jwt,
  auth.jwt() ->> 'sub' as jwt_sub_claim,
  auth.jwt() ->> 'aud' as jwt_audience,
  auth.jwt() ->> 'iss' as jwt_issuer,
  auth.jwt() ->> 'exp' as jwt_expiry,
  auth.uid() as supabase_auth_uid,
  current_user as database_user,
  session_user as session_user;

-- Test if we can see any existing records (should be empty if RLS is working)
SELECT 
  'Existing Records Test' as section,
  COUNT(*) as total_records,
  COUNT(CASE WHEN user_id = (auth.jwt() ->> 'sub') THEN 1 END) as user_records
FROM deep_research_history;

-- Show all policies again for verification
SELECT 
  'Final Policy Check' as section,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'deep_research_history'
ORDER BY cmd, policyname;

-- Test policy conditions
SELECT 
  'Policy Test' as section,
  'Testing user_id match: ' || 
  CASE 
    WHEN (auth.jwt() ->> 'sub') IS NOT NULL 
    THEN 'JWT sub exists: ' || (auth.jwt() ->> 'sub')
    ELSE 'JWT sub is NULL - authentication issue'
  END as test_result;