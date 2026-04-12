import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a placeholder if keys are missing to prevent crash on import
// but throw a descriptive error when any property is accessed.
const createPlaceholderClient = () => {
  return new Proxy({} as any, {
    get(_, prop) {
      throw new Error(
        `Supabase property "${String(prop)}" accessed but Supabase is not configured. ` +
        'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
      );
    }
  });
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createPlaceholderClient();
