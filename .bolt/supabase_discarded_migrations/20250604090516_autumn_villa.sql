/*
  # Update Roadmaps Table User ID Type
  
  1. Changes
    - Modify `user_id` column type from uuid to text to match auth provider's ID format
    - Update RLS policies to handle text-based user IDs
  
  2. Security
    - Recreate RLS policies with proper text comparison
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can read their own roadmaps" ON roadmaps;

-- Modify user_id column type
ALTER TABLE roadmaps 
ALTER COLUMN user_id TYPE text;

-- Recreate policies with text comparison
CREATE POLICY "Users can insert their own roadmaps"
  ON roadmaps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can read their own roadmaps"
  ON roadmaps
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);