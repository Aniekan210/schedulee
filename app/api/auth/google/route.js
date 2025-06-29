import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const requestUrl = new URL(request.url);
  const error = requestUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/signup?error=${error}`);
  }

  const { data, error: authError } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${requestUrl.origin}/api/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (authError) {
    return NextResponse.redirect(
      `${requestUrl.origin}/signup?error=${authError.message}`
    );
  }

  return NextResponse.redirect(data.url);
}
