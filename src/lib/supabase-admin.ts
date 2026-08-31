// This file is kept for backwards compatibility
// All new code should use the supabase client from '@/lib/supabase'
import { supabase } from '@/lib/supabase';

// Export the client as supabaseAdmin for backward compatibility
export const supabaseAdmin = supabase;
export const supabaseClient = supabase; 