// app/api/reset-password/route.js
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

    const { error } = await supabase.auth.resetPasswordForEmail(email);

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
