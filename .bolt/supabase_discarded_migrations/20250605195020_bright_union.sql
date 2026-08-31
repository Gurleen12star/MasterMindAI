/*
  # Fix RLS policies for Clerk integration

  1. Changes
    - Update RLS policies to handle Clerk user IDs correctly
    - Use text comparison for user_id field
    - Ensure policies work with Clerk JWT authentication

  2. Security
    - Maintain strict row-level security
    - Allow users to only access their own data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can insert their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON public.learning_paths;

-- Create updated policies that handle Clerk user IDs correctly
CREATE POLICY "Users can view their own learning paths"
    ON public.learning_paths
    FOR SELECT
    USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can insert their own learning paths"
    ON public.learning_paths
    FOR INSERT
    WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can update their own learning paths"
    ON public.learning_paths
    FOR UPDATE
    USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete their own learning paths"
    ON public.learning_paths
    FOR DELETE
    USING (auth.jwt()->>'sub' = user_id);