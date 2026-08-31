-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can view their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON public.learning_paths;

-- First, disable RLS to match the roadmaps table behavior
ALTER TABLE public.learning_paths DISABLE ROW LEVEL SECURITY;

-- Keep the policies defined but inactive (for future use when enabling RLS)
-- Create policy "Users can insert their own learning paths"
CREATE POLICY "Users can insert their own learning paths"
ON public.learning_paths
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Create policy "Users can view their own learning paths"
CREATE POLICY "Users can view their own learning paths"
ON public.learning_paths
FOR SELECT
USING (auth.uid()::text = user_id);

-- Create policy "Users can update their own learning paths"
CREATE POLICY "Users can update their own learning paths"
ON public.learning_paths
FOR UPDATE
USING (auth.uid()::text = user_id);

-- Create policy "Users can delete their own learning paths"
CREATE POLICY "Users can delete their own learning paths"
ON public.learning_paths
FOR DELETE
USING (auth.uid()::text = user_id);

-- Additional indexes to optimize queries if needed
CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON public.learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_created_at ON public.learning_paths(created_at);

-- Log completion
SELECT 'RLS configuration for learning_paths updated successfully (RLS disabled for development matching roadmaps table).' AS result;