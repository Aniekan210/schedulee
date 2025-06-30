import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${error || "Authentication failed"}`
    );
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () =>
          cookieStore.getAll().map(({ name, value }) => ({ name, value })),
        setAll: async (newCookies) => {
          for (const cookie of newCookies) {
            cookieStore.set(cookie.name, cookie.value);
          }
        },
      },
    }
  );

  try {
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;

    const user = data?.user;

    // Optional: enrich Google users
    if (user?.identities?.[0]?.provider === "google") {
      const email = user.email;
      const businessName =
        email.split("@")[0] || user.user_metadata?.name || "My Business";

      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          business_name: businessName,
          is_paid: false,
        },
      });

      await supabase.from("form_settings").upsert({
        user_id: user.id,
        business_name: businessName,
        logo_url: "",
        bg_color: "#ffffff",
      });
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(err.message)}`
    );
  }
}
