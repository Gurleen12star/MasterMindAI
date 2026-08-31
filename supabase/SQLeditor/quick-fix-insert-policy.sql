-- QUICK FIX: Just fix the INSERT policy for deep_research_history
-- Run this in Supabase Dashboard > SQL Editor

-- Drop the problematic INSERT policy
DROP POLICY IF EXISTS "Users can insert their own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can insert own deep research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can insert own research history" ON deep_research_history;
DROP POLICY IF EXISTS "clerk_insert_deep_research" ON deep_research_history;

-- Create new INSERT policy with Clerk JWT support (matching roadmaps/learning_paths)
CREATE POLICY "deep_research_clerk_insert_fixed"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- Verify the policy was created
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'deep_research_history' AND cmd = 'INSERT';

-- Test message
SELECT 'INSERT policy fixed for deep_research_history with Clerk JWT support!' as status; 