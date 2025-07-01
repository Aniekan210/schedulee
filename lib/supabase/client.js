// /lib/supabase/client.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

// Custom storage that ensures code verifier persistence
const authStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);
      console.log(`Storage GET ${key}:`, value ? "exists" : "null");
      return value;
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      console.log(`Storage SET ${key}`);
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      console.log(`Storage REMOVE ${key}`);
      localStorage.removeItem(key);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
    storage: authStorage,
  },
});
