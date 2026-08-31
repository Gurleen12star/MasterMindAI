/*
  # Add RLS policies for learning paths table
  
  1. Security Changes
    - Enable RLS on learning_paths table
    - Add policy for authenticated users to insert their own records
    - Add policy for authenticated users to read their own records
    - Add policy for authenticated users to update their own records
    - Add policy for authenticated users to delete their own records
*/

-- Enable RLS
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Policy for inserting records (users can only insert their own records)
CREATE POLICY "Users can insert their own learning paths"
ON learning_paths
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for reading records (users can only read their own records)
CREATE POLICY "Users can read their own learning paths"
ON learning_paths
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for updating records (users can only update their own records)
CREATE POLICY "Users can update their own learning paths"
ON learning_paths
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy for deleting records (users can only delete their own records)
CREATE POLICY "Users can delete their own learning paths"
ON learning_paths
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);