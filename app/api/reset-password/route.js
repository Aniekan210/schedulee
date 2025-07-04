// app/api/reset-password/route.js
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function PUT(request) {
  const { password, code, email } = await request.json(); // Add email to the request

  if (!code || typeof code !== "string" || !email) {
    return new Response(
      JSON.stringify({
        error: "Reset code and email are required",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const cookieStore = cookies();
    const supabaseS = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
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

    // Verify OTP with email and token
    const { error: verifyError } = await supabaseS.auth.verifyOtp({
      type: "recovery",
      email, // Include the email address
      token: code,
    });

    if (verifyError) throw verifyError;

    // Update password
    const { error: updateError } = await supabaseS.auth.updateUser({
      password,
    });

    if (updateError) throw updateError;

    // Sign out and redirect
    await supabaseS.auth.signOut();

    return new Response(
      JSON.stringify({
        success: true,
        redirectUrl: `${
          process.env.NEXT_PUBLIC_SITE_URL
        }/success?message=${encodeURIComponent("Password Reset Successfully")}`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    let userError = "Failed to reset password. Please try again.";

    if (
      error.message.includes("invalid token") ||
      error.message.includes("invalid request")
    ) {
      userError = "Invalid or expired reset link. Please request a new one.";
    } else if (error.message.includes("different from the old")) {
      userError = "New password must be different from your current password.";
    }

    return new Response(JSON.stringify({ error: userError }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { supabase } from "@/lib/supabase/client";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      // Convert Supabase errors to more user-friendly messages
      let userError;
      switch (error.message) {
        case "User not found":
          userError = "No account found with this email address";
          break;
        case "Email rate limit exceeded":
          userError = "Too many requests. Please try again later";
          break;
        default:
          userError = "Failed to send reset email. Please try again";
      }
      return new Response(JSON.stringify({ error: userError }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Password reset error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
