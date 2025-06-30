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
    if (error) throw error;

    if (!session) {
      throw new Error("No session returned");
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

    // Create a redirect response
    const response = NextResponse.redirect(`${requestUrl.origin}/dashboard`);

    // Ensure cookies are set (sometimes needed in serverless environments)
    response.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: session.expires_in,
      sameSite: "lax",
      path: "/",
    });
    response.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(
        err.message || "Authentication failed"
      )}`
    );
  }
}
