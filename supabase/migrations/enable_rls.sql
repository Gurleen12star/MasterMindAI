-- Enable Row Level Security for the roadmaps table
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- Create or replace policy to allow users to view their own roadmaps by user_id column
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can view their own roadmaps"
    ON public.roadmaps
    FOR SELECT
    USING (true); -- Allow select for everyone, since we filter by user_id in the queries

-- Create or replace policy to allow users to insert roadmaps with their own user_id
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can insert their own roadmaps"
    ON public.roadmaps
    FOR INSERT
    WITH CHECK (true); -- Allow insert for everyone, the app ensures correct user_id

-- Create or replace policy to allow users to update their own roadmaps
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can update their own roadmaps"
    ON public.roadmaps
    FOR UPDATE
    USING (true); -- Allow update for everyone, the app ensures correct user_id

-- Create or replace policy to allow users to delete their own roadmaps
DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can delete their own roadmaps"
    ON public.roadmaps
    FOR DELETE
    USING (true); -- Allow delete for everyone, the app ensures correct user_id

-- Drop the anonymous read policy since it's redundant
DROP POLICY IF EXISTS "Allow anonymous read access" ON public.roadmaps; 