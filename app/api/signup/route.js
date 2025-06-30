import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password, business_name } = await request.json();

  if (!business_name?.trim()) {
    return NextResponse.json(
      { error: "Please provide a name for your business" },
      { status: 400 }
    );
  }

  try {
    // Create user with PKCE flow
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name,
          is_paid: false,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    });

    if (authError) throw authError;

    // Only create settings if we have a user ID (email might not be confirmed yet)
    if (authData.user?.id) {
      const { error: settingsError } = await supabase
        .from("form_settings")
        .upsert({
          user_id: authData.user.id,
          business_name,
          logo_url: "",
          bg_color: "#ffffff",
        });

      if (settingsError) throw settingsError;
    }

    return NextResponse.json({
      success: true,
      needsConfirmation: true, // Always require confirmation with PKCE flow
    });
  } catch (error) {
    let errorMessage = "Registration failed";

    if (error.message.includes("User already registered")) {
      errorMessage = "This email is already registered. Please log in instead.";
    } else if (error.message.includes("password")) {
      errorMessage = "Please choose a stronger password (min 6 characters)";
    } else if (error.message.includes("email")) {
      errorMessage = "Please provide a valid email address";
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
