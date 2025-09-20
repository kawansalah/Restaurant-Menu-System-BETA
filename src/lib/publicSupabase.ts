import { createClient } from "@supabase/supabase-js";

/**
 * Public Supabase client for frontend access
 * This client doesn't persist sessions and bypasses admin user restrictions
 * Use this for public restaurant data, menu items, categories, etc.
 */
export const publicSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Don't persist any session
      autoRefreshToken: false, // Don't auto refresh tokens
    },
  }
);

export default publicSupabase;
