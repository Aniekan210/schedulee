import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { DateTime } from "luxon";

// Convert time between timezones using a fixed reference date
function convertWallTime(time, fromZone, toZone) {
  if (!time) return null;

  try {
    const [hours, minutes] = time.split(":").map(Number);
    const dt = DateTime.fromObject(
      { year: 2025, month: 1, day: 1, hour: hours, minute: minutes },
      { zone: fromZone }
    );
    return dt.setZone(toZone).toFormat("HH:mm");
  } catch (error) {
    console.error("Error converting wall time:", error);
    return null;
  }
}

// GET: Fetch all overrides
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const business_id = searchParams.get("business_id");
  const timezone = searchParams.get("timezone") || "UTC";

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

    const result = data.map((override) => ({
      ...override,
      date: override.date, // no conversion
      start_time: override.start_time
        ? convertWallTime(override.start_time, "UTC", timezone)
        : null,
      end_time: override.end_time
        ? convertWallTime(override.end_time, "UTC", timezone)
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

// POST: Create or update override
export async function POST(request) {
  const body = await request.json();

  try {
    const { business_id, timezone = "UTC", ...override } = body;

    if (!business_id) {
      return NextResponse.json(
        { error: "business_id is required" },
        { status: 400 }
      );
    }

    const dateOnly = override.date;
    if (!DateTime.fromISO(dateOnly).isValid) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    let startTimeUTC = null;
    let endTimeUTC = null;

    if (override.is_available) {
      if (override.start_time) {
        startTimeUTC = convertWallTime(override.start_time, timezone, "UTC");
        if (!startTimeUTC) {
          return NextResponse.json(
            { error: "Invalid start_time format" },
            { status: 400 }
          );
        }
      }

      if (override.end_time) {
        endTimeUTC = convertWallTime(override.end_time, timezone, "UTC");
        if (!endTimeUTC) {
          return NextResponse.json(
            { error: "Invalid end_time format" },
            { status: 400 }
          );
        }
      }

      if (startTimeUTC && endTimeUTC) {
        const start = DateTime.fromFormat(startTimeUTC, "HH:mm");
        const end = DateTime.fromFormat(endTimeUTC, "HH:mm");
        if (end <= start) {
          return NextResponse.json(
            { error: "End time must be after start time" },
            { status: 400 }
          );
        }
      }
    }

    const dbData = {
      ...override,
      date: dateOnly,
      start_time: startTimeUTC,
      end_time: endTimeUTC,
      business_id,
    };

    const { data, error } = await supabase
      .from("overrides")
      .upsert(dbData, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;

    const responseData = {
      ...data,
      date: data.date,
      start_time: data.start_time
        ? convertWallTime(data.start_time, "UTC", timezone)
        : null,
      end_time: data.end_time
        ? convertWallTime(data.end_time, "UTC", timezone)
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

// PUT: Same as POST
export async function PUT(request) {
  return POST(request);
}

// DELETE: Remove override
export async function DELETE(request) {
  const body = await request.json();

  try {
    const { id, timezone = "UTC" } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { data: existingOverride, error: fetchError } = await supabase
      .from("overrides")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase.from("overrides").delete().eq("id", id);
    if (error) throw error;

    const responseData = {
      ...existingOverride,
      date: existingOverride.date,
      start_time: existingOverride.start_time
        ? convertWallTime(existingOverride.start_time, "UTC", timezone)
        : null,
      end_time: existingOverride.end_time
        ? convertWallTime(existingOverride.end_time, "UTC", timezone)
        : null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error deleting override:", error);
    return NextResponse.json(
      { error: "Failed to delete override" },
      { status: 500 }
    );
  }
}
