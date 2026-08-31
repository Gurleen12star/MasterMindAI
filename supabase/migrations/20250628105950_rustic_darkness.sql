/*
  # Tavus Conversation Personas Table
  
  1. New Tables
    - `tavus_personas`
      - `id` (uuid, primary key)
      - `name` (text, e.g., "History Teacher")
      - `persona_id` (text, Tavus API persona ID)
      - `replica_id` (text, Tavus API replica ID)
      - `description` (text, short description of the persona)
      - `category` (text, e.g., "academic", "business", etc.)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `tavus_personas` table
    - Allow authenticated users to read personas
    - Only admins can create/update/delete personas
*/

-- Create tavus_personas table for managing AI conversation partners
CREATE TABLE IF NOT EXISTS public.tavus_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  persona_id text NOT NULL,
  replica_id text NOT NULL,
  description text NOT NULL,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tavus_personas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all users to view personas" 
  ON public.tavus_personas
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert personas" 
  ON public.tavus_personas
  FOR INSERT 
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update personas" 
  ON public.tavus_personas
  FOR UPDATE 
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete personas" 
  ON public.tavus_personas
  FOR DELETE 
  TO authenticated
  USING (is_admin());

-- Add update trigger
CREATE TRIGGER update_tavus_personas_updated_at
  BEFORE UPDATE ON public.tavus_personas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial personas based on current implementation
INSERT INTO public.tavus_personas (name, persona_id, replica_id, description, category)
VALUES
  ('Academic Tutor', 'p88964a7', 'rfb51183fe', 'Get help with academic subjects', 'education'),
  ('History Teacher', 'pc55154f229a', 'r6ae5b6efc9d', 'Discuss historical events and concepts', 'education'),
  ('AI Interviewer', 'pe13ed370726', 'r9d30b0e55ac', 'Practice job interviews and get feedback', 'career'),
  ('Tavus Researcher', 'p48fdf065d6b', 'rf4703150052', 'Explore research topics in depth', 'research'),
  ('Healthcare Assistant', 'p5d11710002a', 'r4317e64d25a', 'Practice patient intake conversations', 'healthcare'),
  ('Sales Coach', 'pdced222244b', 'rc2146c13e81', 'Learn sales techniques and practice pitches', 'business'),
  ('Corporate Trainer', 'p7fb0be3', 'ra54d1d861', 'Practice corporate training and presentations', 'business')
ON CONFLICT DO NOTHING;

-- Create a function to get personas based on category
CREATE OR REPLACE FUNCTION get_tavus_personas(
  category_filter text DEFAULT NULL
) RETURNS SETOF public.tavus_personas AS $$
BEGIN
  IF category_filter IS NOT NULL THEN
    RETURN QUERY
    SELECT * FROM public.tavus_personas
    WHERE category = category_filter AND is_active = true
    ORDER BY name ASC;
  ELSE
    RETURN QUERY
    SELECT * FROM public.tavus_personas
    WHERE is_active = true
    ORDER BY name ASC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;