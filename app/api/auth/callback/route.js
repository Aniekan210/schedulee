// app/api/auth/callback/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Authentication failed`
    );
  }

  try {
    // Exchange code for session
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !session) {
      throw error || new Error("No session returned");
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        business_name:
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "My Business",
        is_paid: false,
      },
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
