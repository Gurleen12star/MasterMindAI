/*
  # Fix Deep Research History RLS Policies

  1. Security Updates
    - Drop existing RLS policies that use uid() (Supabase auth)
    - Create new policies that work with Clerk JWT tokens
    - Use jwt() ->> 'sub' to get the user ID from Clerk's JWT

  2. Policy Changes
    - Update INSERT policy to use Clerk user ID
    - Update SELECT policy to use Clerk user ID  
    - Update UPDATE policy to use Clerk user ID
    - Update DELETE policy to use Clerk user ID
*/

-- Drop existing policies that use uid()
DROP POLICY IF EXISTS "Users can insert own research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can read own research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can update own research history" ON deep_research_history;
DROP POLICY IF EXISTS "Users can delete own research history" ON deep_research_history;

-- Create new policies that work with Clerk JWT tokens
CREATE POLICY "Users can insert their own deep research history"
  ON deep_research_history
  FOR INSERT
  TO authenticated
  WITH CHECK ((jwt() ->> 'sub'::text) = user_id);

CREATE POLICY "Users can read their own deep research history"
  ON deep_research_history
  FOR SELECT
  TO authenticated
  USING ((jwt() ->> 'sub'::text) = user_id);

CREATE POLICY "Users can update their own deep research history"
  ON deep_research_history
  FOR UPDATE
  TO authenticated
  USING ((jwt() ->> 'sub'::text) = user_id)
  WITH CHECK ((jwt() ->> 'sub'::text) = user_id);

CREATE POLICY "Users can delete their own deep research history"
  ON deep_research_history
  FOR DELETE
  TO authenticated
  USING ((jwt() ->> 'sub'::text) = user_id);