import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Public Supabase client — safe to use in both client and server contexts.
 * Uses the anon key, so it is bounded by RLS policies.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder",
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Server-only Supabase client that uses the service role key and bypasses
 * RLS. Never import or call this from a Client Component — it is lazy so
 * the service key is never read from `process.env` in the browser bundle.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin() must only be called on the server");
  }
  if (cachedAdminClient) return cachedAdminClient;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  cachedAdminClient = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdminClient;
}
