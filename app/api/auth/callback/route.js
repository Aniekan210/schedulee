import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/signup?error=${error.message}`
      );
    }

    // For Google signups, set default metadata
    if (data.user?.identities?.[0]?.provider === "google") {
      const email = data.user.email;
      const businessName = email.split("@")[0] || "My Business";

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          business_name: businessName,
          is_paid: false,
        },
      });

      // Create default form settings
      await supabase.from("form_settings").upsert({
        user_id: data.user.id,
        business_name: businessName,
        logo_url: "",
        bg_color: "#ffffff",
      });
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
