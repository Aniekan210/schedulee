import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { DateTime } from "luxon";

// Proper timezone-aware time converter
function convertTime(time, timezone, toUTC = true) {
  if (!time) return null;
  
  try {
    // Ensure time is in HH:mm format
    const [hours, minutes] = time.split(':').map(part => part.padStart(2, '0'));
    const timeString = `${hours}:${minutes}`;

    if (toUTC) {
      // Convert from local timezone to UTC
      const localTime = DateTime.fromFormat(timeString, 'HH:mm', { zone: timezone });
      if (!localTime.isValid) {
        console.error('Invalid local time:', localTime.invalidExplanation);
        return null;
      }
      return localTime.toUTC().toFormat('HH:mm');
    } else {
      // Convert from UTC to local timezone
      const utcTime = DateTime.fromFormat(timeString, 'HH:mm', { zone: 'UTC' });
      if (!utcTime.isValid) {
        console.error('Invalid UTC time:', utcTime.invalidExplanation);
        return null;
      }
      return utcTime.setZone(timezone).toFormat('HH:mm');
    }
  } catch (error) {
    console.error('Error converting time:', error);
    return null;
  }
}

// GET: Fetch all overrides for a business
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const business_id = searchParams.get("business_id");
  const timezone = decodeURIComponent(searchParams.get("timezone")) || "UTC";

  if (!business_id) {
    return NextResponse.json(
      { error: "business_id is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("overrides")
      .select("*")
      .eq("business_id", business_id)
      .order("date", { ascending: true });

    if (error) throw error;

    const result = (data || []).map((override) => ({
      ...override,
      start_time: override.start_time
        ? convertTime(override.start_time, timezone, false)
        : null,
      end_time: override.end_time
        ? convertTime(override.end_time, timezone, false)
        : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching overrides:", error);
    return NextResponse.json(
      { error: "Failed to fetch overrides" },
      { status: 500 }
    );
  }
}

// POST: Upsert an override
export async function POST(request) {
  const body = await request.json();

  try {
    const { business_id, timezone = "UTC", ...override } = body;

    if (!timezone) {
      return NextResponse.json(
        { error: "timezone is required in request body or params" },
        { status: 400 }
      );
    }

    let startTimeUTC = null;
    let endTimeUTC = null;

    if (override.is_available && override.start_time && override.end_time) {
      startTimeUTC = convertTime(override.start_time, timezone, true);
      endTimeUTC = convertTime(override.end_time, timezone, true);
    }

    const { data, error } = await supabase
      .from("overrides")
      .upsert(
        {
          ...override,
          start_time: startTimeUTC,
          end_time: endTimeUTC,
          business_id,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) throw error;

    const responseData = {
      ...data,
      start_time: data.start_time
        ? convertTime(data.start_time, timezone, false)
        : null,
      end_time: data.end_time
        ? convertTime(data.end_time, timezone, false)
        : null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error saving override:", error);
    return NextResponse.json(
      { error: "Failed to save override" },
      { status: 500 }
    );
  }
}

// PUT = same logic as POST (upsert)
export async function PUT(request) {
  return POST(request);
}

// DELETE: Remove override by ID
export async function DELETE(request) {
  const body = await request.json();

  try {
    const { id } = body;

    const { error } = await supabase.from("overrides").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting override:", error);
    return NextResponse.json(
      { error: "Failed to delete override" },
      { status: 500 }
    );
  }
}
