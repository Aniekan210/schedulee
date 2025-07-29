import { supabase } from "@/lib/supabase/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("form_settings")
      .select("*")
      .eq("user_id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return Response.json({ error: "No settings found" }, { status: 404 });
    }

    return Response.json({
      bgColor: data.bg_color,
      logoUrl: data.logo_url,
      businessName: data.business_name,
      timezone: data.timezone,
      textColor: data.text_color,
      accentColor: data.accent_color,
      fontFamily: data.font_family,
      borderRadius: data.border_radius,
      ctaText: data.cta_text,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const formData = await request.formData();
  const userId = formData.get("userId");
  const businessName = formData.get("businessName");
  const bgColor = formData.get("bgColor");
  const timezone = formData.get("timezone");
  const textColor = formData.get("textColor");
  const accentColor = formData.get("accentColor");
  const fontFamily = formData.get("fontFamily");
  const borderRadius = formData.get("borderRadius");
  const ctaText = formData.get("ctaText");
  const logoFile = formData.get("logoFile");

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    let logoUrl = null;

    // Handle logo upload if file exists and has size
    if (logoFile && logoFile.size > 0) {
      // First check if there's an existing logo to delete
      const { data: existingSettings } = await supabase
        .from("form_settings")
        .select("logo_url")
        .eq("user_id", userId)
        .single();

      // Delete old logo if it exists
      if (existingSettings?.logo_url) {
        const oldUrlParts = existingSettings.logo_url.split("/form-assets/");
        if (oldUrlParts.length === 2) {
          const oldFilePath = `form-logos/${oldUrlParts[1]}`;
          await supabase.storage.from("form-assets").remove([oldFilePath]);
        }
      }

      // Upload new logo
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `form-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("form-assets")
        .upload(filePath, logoFile, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("form-assets")
        .getPublicUrl(filePath);

      logoUrl = urlData.publicUrl;
    }

    // Update all settings fields
    const { data, error } = await supabase
      .from("form_settings")
      .update({
        business_name: businessName,
        bg_color: bgColor,
        timezone: timezone,
        text_color: textColor,
        accent_color: accentColor,
        font_family: fontFamily,
        border_radius: borderRadius,
        cta_text: ctaText,
        ...(logoUrl && { logo_url: logoUrl }),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return Response.json({
      bgColor: data.bg_color,
      logoUrl: data.logo_url,
      businessName: data.business_name,
      timezone: data.timezone,
      textColor: data.text_color,
      accentColor: data.accent_color,
      fontFamily: data.font_family,
      borderRadius: data.border_radius,
      ctaText: data.cta_text,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return Response.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // First get the current logo URL
    const { data: settings, error: fetchError } = await supabase
      .from("form_settings")
      .select("logo_url")
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;
    if (!settings) {
      return Response.json({ error: "No settings found" }, { status: 404 });
    }

    const logoUrl = settings.logo_url;
    let deleteResult = null;

    // If there's a logo URL, delete it from storage
    if (logoUrl) {
      // Extract the file path from the URL
      const urlParts = logoUrl.split("/form-assets/");
      if (urlParts.length === 2) {
        const filePath = `form-logos/${urlParts[1]}`;

        // Delete the file from storage
        deleteResult = await supabase.storage
          .from("form-assets")
          .remove([filePath]);
      }
    }

    // Update the database to remove the logo URL
    const { data, error } = await supabase
      .from("form_settings")
      .update({ logo_url: null })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return Response.json({
      success: true,
      storageDeleteResult: deleteResult,
      newSettings: data,
    });
  } catch (error) {
    console.error("Error deleting logo:", error);
    return Response.json(
      { error: error.message || "Failed to delete logo" },
      { status: 500 }
    );
  }
}
