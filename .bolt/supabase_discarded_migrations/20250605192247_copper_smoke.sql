/*
  # Add RLS policies for learning_paths table
  
  1. Security Changes
    - Enable RLS on learning_paths table
    - Add policies for authenticated users to:
      - Read their own learning paths
      - Create new learning paths
      - Update their own learning paths
      - Delete their own learning paths
*/

-- Enable RLS
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own learning paths
CREATE POLICY "Users can read own learning paths"
ON learning_paths
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- Policy for users to insert their own learning paths
CREATE POLICY "Users can create learning paths"
ON learning_paths
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- Policy for users to update their own learning paths
CREATE POLICY "Users can update own learning paths"
ON learning_paths
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Policy for users to delete their own learning paths
CREATE POLICY "Users can delete own learning paths"
ON learning_paths
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);