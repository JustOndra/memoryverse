import { createClient } from '@supabase/supabase-js';

// Prefer Vite `import.meta.env` when available, otherwise fall back to process.env for Node-based tests
const supabaseUrl =
  (typeof (import.meta as any)?.env !== 'undefined' &&
    (import.meta as any).env.VITE_SUPABASE_URL) ||
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  (typeof (import.meta as any)?.env !== 'undefined' &&
    (import.meta as any).env.VITE_SUPABASE_ANON_KEY) ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(
  supabaseUrl as string,
  supabaseAnonKey as string
);

export default supabaseClient;
