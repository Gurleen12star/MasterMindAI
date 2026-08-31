-- COMPREHENSIVE FIX for Deep Research RLS Policies with Clerk Authentication
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- Step 1: Drop ALL existing policies to ensure clean slate
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies for deep_research_history table
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'deep_research_history'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON deep_research_history', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 2: Verify table structure and ensure RLS is enabled
ALTER TABLE deep_research_history ENABLE ROW LEVEL SECURITY;

-- Step 3: Create comprehensive policies that work with Clerk JWT tokens
-- These policies check that the user_id column matches the 'sub' claim from the JWT

-- INSERT Policy - Allow users to insert their own records
CREATE POLICY "deep_research_insert_policy"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (auth.jwt() ->> 'sub')::text
  );

-- SELECT Policy - Allow users to read their own records
CREATE POLICY "deep_research_select_policy"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub')::text
  );

-- UPDATE Policy - Allow users to update their own records
CREATE POLICY "deep_research_update_policy"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub')::text
  )
  WITH CHECK (
    user_id = (auth.jwt() ->> 'sub')::text
  );

-- DELETE Policy - Allow users to delete their own records
CREATE POLICY "deep_research_delete_policy"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub')::text
  );

-- Step 4: Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON deep_research_history TO authenticated;

-- Step 5: Verify the policies were created correctly
SELECT 
  'Policy Verification' as section,
  policyname,
  cmd as operation,
  permissive,
  roles,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE tablename = 'deep_research_history'
ORDER BY cmd, policyname;

-- Step 6: Test the JWT extraction function
SELECT 
  'JWT Test' as section,
  'Current JWT sub claim: ' || COALESCE((auth.jwt() ->> 'sub'), 'NULL') as jwt_sub,
  'Current user ID: ' || COALESCE(auth.uid()::text, 'NULL') as auth_uid,
  'Session exists: ' || CASE WHEN auth.jwt() IS NOT NULL THEN 'YES' ELSE 'NO' END as has_session;

-- Step 7: Show table permissions
SELECT 
  'Table Permissions' as section,
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'deep_research_history'
ORDER BY grantee, privilege_type;

-- Step 8: Final status message
SELECT 
  'SUCCESS' as status,
  'Deep Research RLS policies have been completely reset and configured for Clerk authentication' as message,
  'Next: Test the application by creating a new research entry' as next_step;