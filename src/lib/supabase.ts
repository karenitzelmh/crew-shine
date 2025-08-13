import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Evita crashear si faltan envs
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

if (!url || !key) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Realtime/DB disabled until you add a local .env."
  );
}
