import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, business_name } = await request.json();

    console.log("hi 1");

    // Validate inputs
    if (!business_name?.trim()) {
      return NextResponse.json(
        { error: "Please provide a name for your business" },
        { status: 400 }
      );
    }

    if (!email?.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create user with PKCE flow
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name,
          is_paid: false,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    if (authError) {
      console.error("Signup error:", authError);
      throw authError;
    }

    // Successful response
    return NextResponse.json({
      success: true,
      needsConfirmation: true,
      email: authData.user?.email, // Return email for confirmation message
    });
  } catch (error) {
    console.error("Registration error:", error);

    let errorMessage = "Registration failed. Please try again.";
    let statusCode = 500;

    if (error.message.includes("User already registered")) {
      errorMessage = "This email is already registered. Please log in instead.";
      statusCode = 409;
    } else if (error.message.includes("password")) {
      errorMessage = "Please choose a stronger password (min 6 characters)";
      statusCode = 400;
    } else if (error.message.includes("email")) {
      errorMessage = "Please provide a valid email address";
      statusCode = 400;
    }

    console.log("hi 4");

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      {
        status: statusCode,
      }
    );
  }
}
