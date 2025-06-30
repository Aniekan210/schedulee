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
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange error:", exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(
          "Failed to authenticate"
        )}`
      );
    }

    const user = data?.user;

    if (user?.identities?.[0]?.provider === "google") {
      const email = user.email;
      const businessName =
        email.split("@")[0] || user.user_metadata?.name || "My Business";

      // Update user metadata
      const { error: updateError } = await supabase
        .from("users")
        .update({
          user_metadata: {
            business_name: businessName,
            is_paid: false,
          },
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Upsert form settings
      const { error: upsertError } = await supabase
        .from("form_settings")
        .upsert({
          user_id: user.id,
          business_name: businessName,
          logo_url: "",
          bg_color: "#ffffff",
        });

      if (upsertError) throw upsertError;
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(
        err.message || "Authentication error"
      )}`
    );
  }
}
