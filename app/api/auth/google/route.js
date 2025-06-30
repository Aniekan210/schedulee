import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });

    if (error) throw error;

    // Return the URL for client-side redirect (matches your client code)
    return NextResponse.json({ url: data.url });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect with Google" },
      { status: 400 }
    );
  }
}
