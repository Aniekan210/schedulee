import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Authentication failed`
    );
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY,
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

  try {
    // Exchange code for session
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    // Set user metadata (matches your signup route)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        business_name: user.user_metadata?.name || user.email.split('@')[0] || "My Business",
        is_paid: false,
      }
    });

    if (updateError) throw updateError;

    // Redirect to dashboard
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(
        err.message || "Authentication failed"
      )}`
    );
  }
}