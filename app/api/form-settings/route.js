import { supabase } from "@/lib/supabase/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Validate the ID parameter
  if (!id) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // Fetch settings from Supabase
    const { data, error } = await supabase
      .from("form_settings")
      .select("*")
      .eq("user_id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return new Response(
        JSON.stringify({ error: "No settings found for the provided ID" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Map the data to your settings structure
    const settings = {
      bgColor: data.bg_color,
      logoUrl: data.logo_url || "",
      businessName: data.business_name || "",
      businessTimezone: data.timezone || "America/Halifax",
    };

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching form settings:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
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
