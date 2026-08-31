-- Create roadmaps table
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    topic text NOT NULL,
    mermaid_code text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Temporarily disable RLS for development
ALTER TABLE public.roadmaps DISABLE ROW LEVEL SECURITY;

-- Keep the policies defined for future use when enabling RLS

-- Create policy to allow users to view their own roadmaps
CREATE POLICY IF NOT EXISTS "Users can view their own roadmaps"
    ON public.roadmaps
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own roadmaps
CREATE POLICY IF NOT EXISTS "Users can insert their own roadmaps"
    ON public.roadmaps
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own roadmaps
CREATE POLICY IF NOT EXISTS "Users can update their own roadmaps"
    ON public.roadmaps
    FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own roadmaps
CREATE POLICY IF NOT EXISTS "Users can delete their own roadmaps"
    ON public.roadmaps
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- When ready for production, enable RLS with this command:
-- ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY; 