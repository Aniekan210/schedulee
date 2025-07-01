// lib/supabase/server.js
import { createServerClient } from "@supabase/ssr";
import { cookies as getCookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await getCookies(); // ✅ must await!

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}
