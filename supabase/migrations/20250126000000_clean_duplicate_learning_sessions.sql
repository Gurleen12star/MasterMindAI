/*
  # Clean up duplicate personalized learning sessions

  This migration removes duplicate learning sessions for the same user, topic, and personality combination,
  keeping only the most recent session for each unique combination.
*/

-- Create a temporary table to identify sessions to keep (most recent for each user/topic/personality combination)
WITH sessions_to_keep AS (
  SELECT DISTINCT ON (user_id, lower(topic), personality) 
    id,
    user_id,
    topic,
    personality,
    created_at
  FROM public.personalized_learning_sessions
  ORDER BY user_id, lower(topic), personality, created_at DESC
),
-- Identify sessions to delete (all except the most recent ones)
sessions_to_delete AS (
  SELECT pls.id
  FROM public.personalized_learning_sessions pls
  LEFT JOIN sessions_to_keep stk ON pls.id = stk.id
  WHERE stk.id IS NULL
)
-- Delete the duplicate sessions
DELETE FROM public.personalized_learning_sessions
WHERE id IN (SELECT id FROM sessions_to_delete);

-- Add a unique constraint to prevent future duplicates (optional - commented out as it might be too restrictive)
-- ALTER TABLE public.personalized_learning_sessions 
-- ADD CONSTRAINT unique_user_topic_personality 
-- UNIQUE (user_id, topic, personality); 