// app/api/login/route.js
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const supabase = await createSupabaseServerClient(); // ✅ await here!

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    let errorMessage = "Login failed";
    let statusCode = 400;

    const msg = error.message || "";

    if (msg.includes("Invalid login credentials")) {
      errorMessage = "Incorrect email or password";
    } else if (msg.includes("Email not confirmed")) {
      errorMessage = "Please verify your email first";
      statusCode = 403;
    } else if (msg.includes("too many requests")) {
      errorMessage = "Too many attempts. Try again later";
      statusCode = 429;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
