/*
  # Fix Deep Research Authentication Issues

  This migration resolves RLS policy conflicts for the deep_research_history table
  by completely resetting and recreating policies that work with Clerk authentication.

  1. Security Changes
    - Remove all existing conflicting RLS policies
    - Create new policies that properly handle Clerk JWT tokens
    - Ensure user_id matching works correctly with Clerk's 'sub' claim

  2. Policy Updates
    - INSERT: Allow authenticated users to insert their own records
    - SELECT: Allow users to read their own research history
    - UPDATE: Allow users to update their own records
    - DELETE: Allow users to delete their own records
*/

-- Step 1: Drop all existing policies to avoid conflicts
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
    END LOOP;
    
    RAISE NOTICE 'All existing policies dropped for deep_research_history';
END $$;

-- Step 2: Ensure RLS is enabled
ALTER TABLE deep_research_history ENABLE ROW LEVEL SECURITY;

-- Step 3: Create new, clean policies with Clerk JWT support
CREATE POLICY "deep_research_clerk_insert"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (auth.jwt() ->> 'sub')::text
  );

CREATE POLICY "deep_research_clerk_select"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub')::text
  );

CREATE POLICY "deep_research_clerk_update"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub')::text
  )
  WITH CHECK (
    user_id = (auth.jwt() ->> 'sub')::text
  );

CREATE POLICY "deep_research_clerk_delete"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING (
    user_id = (auth.jwt() ->> 'sub')::text
  );

-- Step 4: Grant necessary permissions to authenticated role
GRANT ALL ON deep_research_history TO authenticated;
GRANT USAGE ON SEQUENCE deep_research_history_id_seq TO authenticated;

-- Step 5: Verify the policies are created correctly
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'deep_research_history';
    
    IF policy_count = 4 THEN
        RAISE NOTICE 'SUCCESS: All 4 RLS policies created for deep_research_history';
    ELSE
        RAISE WARNING 'WARNING: Expected 4 policies, found %', policy_count;
    END IF;
END $$;