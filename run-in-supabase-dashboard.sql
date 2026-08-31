-- First, temporarily disable RLS to make changes
ALTER TABLE public.roadmaps DISABLE ROW LEVEL SECURITY;

-- Now, enable Row Level Security for the roadmaps table with open policies
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- Create or replace policy to allow all operations based on user_id filtering in app code
DROP POLICY IF EXISTS "Public access policy" ON public.roadmaps;
CREATE POLICY "Public access policy"
    ON public.roadmaps
    USING (true);

-- Additional indexes to optimize queries if needed
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON public.roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_created_at ON public.roadmaps(created_at);

-- Log completion
SELECT 'RLS configuration updated successfully. App should now be able to save and load roadmaps.' AS result; 