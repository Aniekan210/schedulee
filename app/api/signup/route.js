import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  const { email, password, business_name } = await request.json();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    });

    if (authError) {
      throw authError;
    }

    // Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        business_name,
        is_paid: false,
      },
    });

    if (metadataError) {
      throw metadataError;
    }

    // Create default form settings
    const { error: formSettingsError } = await supabase
      .from("form_settings")
      .insert({
        user_id: authData.user.id,
        business_name,
        logo_url: "",
        bg_color: "#ffffff",
      });

    if (formSettingsError) {
      throw formSettingsError;
    }

    // Manually set session cookie for immediate login
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        session: sessionData.session,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
