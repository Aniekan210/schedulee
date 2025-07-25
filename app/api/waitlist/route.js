// app/api/waitlist/route.js
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // Ensure this is an Edge Function

export async function POST(request) {
  try {
    const formData = await request.json();

    // Initialize Supabase client with your public env variables
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY
    );

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("waitlist-func", {
      body: formData, // No need to stringify, Supabase client handles this
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message || "Failed to submit to waitlist");
    }

    return new Response(null, { status: 201 });
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return new Response(
      JSON.stringify({
        message: "You're already on the list",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
