// /lib/supabase/client.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // ...
    detectSessionInUrl: true,
    flowType: "pkce",
    storage: {
      getItem: () => Promise.resolve("FETCHED_TOKEN"),
      setItem: () => {},
      removeItem: () => {},
    },
  },
});
