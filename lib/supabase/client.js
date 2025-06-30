// /lib/supabase/client.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
    storage: typeof window !== "undefined" ? localStorage : undefined,
  },
});
