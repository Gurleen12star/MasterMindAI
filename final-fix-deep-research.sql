-- FINAL FIX for Deep Research Authentication Issues
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- Step 1: Completely remove all existing policies (force clean slate)
DO $$ 
BEGIN
    -- Drop all possible policy variations
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert their own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can read their own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can read own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own deep research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can read own research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own research history" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "clerk_insert_deep_research" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "clerk_read_deep_research" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "clerk_update_deep_research" ON deep_research_history';
    EXECUTE 'DROP POLICY IF EXISTS "clerk_delete_deep_research" ON deep_research_history';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Some policies may not have existed: %', SQLERRM;
END $$;

-- Step 2: Temporarily disable RLS to test basic access
ALTER TABLE deep_research_history DISABLE ROW LEVEL SECURITY;

-- Step 3: Test insert without RLS (this should work)
-- Note: This is just for testing - we'll re-enable RLS after creating proper policies

-- Step 4: Re-enable RLS
ALTER TABLE deep_research_history ENABLE ROW LEVEL SECURITY;

-- Step 5: Create new, clean policies with unique names
CREATE POLICY "deep_research_clerk_insert_v2"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "deep_research_clerk_select_v2"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "deep_research_clerk_update_v2"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "deep_research_clerk_delete_v2"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Step 6: Verify the new policies
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'deep_research_history'
ORDER BY policyname;

-- Step 7: Show current table permissions
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'deep_research_history';

-- Success message
SELECT 'Deep Research policies have been reset and recreated with Clerk JWT support!' as status; 