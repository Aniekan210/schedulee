import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get the session cookies
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Set cookies manually if needed (alternative approach)
    const response = NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });

    // Set cookies if they're not automatically set
    if (session) {
      response.cookies.set("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      response.cookies.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
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

    return NextResponse.json(
      {
        error: errorMessage,
        status: statusCode,
      },
      { status: statusCode }
    );
  }
}
