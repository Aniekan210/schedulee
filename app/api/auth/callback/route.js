// app/api/auth/callback/route.js
import { NextResponse } from "next/server";
import { cookies as getCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
  }

  const cookieStore = await getCookies();
  const supabase = createServerClient(
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

  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=auth_failed`
    );
  }

  const user = session.user;
  const existingMeta = user.user_metadata || {};

  const updatedMeta = {
    business_name: existingMeta.business_name || "My Business",
    is_paid: existingMeta.is_paid || false,
  };

  const { error: updateError } = await supabase.auth.updateUser({
    data: updatedMeta,
  });

  if (updateError) {
    console.error("Failed to update user metadata:", updateError);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=meta_update_failed`
    );
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard/bookings`);
}
