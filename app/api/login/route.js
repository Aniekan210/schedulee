import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        // PKCE parameters
        flowType: "pkce",
        // Redirect after login
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    });

    if (error) throw error;

    // For API responses (not redirects)
    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    let errorMessage = "Login failed";
    let statusCode = 400;

    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Incorrect email or password";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email first";
      statusCode = 403;
    } else if (error.message.includes("too many requests")) {
      errorMessage = "Too many attempts. Try again later";
      statusCode = 429;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
