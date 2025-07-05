import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { DateTime } from "luxon";

function convertTime(time, timezone, toUTC = true) {
  if (!time) return null;

  try {
    // Ensure time is in HH:mm format
    const [hours, minutes] = time
      .split(":")
      .map((part) => part.padStart(2, "0"));
    const timeString = `${hours}:${minutes}`;

    if (toUTC) {
      // Convert from local timezone to UTC
      const localTime = DateTime.fromFormat(timeString, "HH:mm", {
        zone: timezone,
      });
      if (!localTime.isValid) {
        console.error("Invalid local time:", localTime.invalidExplanation);
        return null;
      }
      return localTime.toUTC().toFormat("HH:mm");
    } else {
      // Convert from UTC to local timezone
      const utcTime = DateTime.fromFormat(timeString, "HH:mm", { zone: "UTC" });
      if (!utcTime.isValid) {
        console.error("Invalid UTC time:", utcTime.invalidExplanation);
        return null;
      }
      return utcTime.setZone(timezone).toFormat("HH:mm");
    }
  } catch (error) {
    console.error("Error converting time:", error);
    return null;
  }
}

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
    const { data: availabilities, error: availError } = await supabase
      .from("availability")
      .select("*")
      .eq("business_id", business_id);

    if (availError) throw availError;

    if (!availabilities || availabilities.length === 0) {
      return NextResponse.json([]);
    }

    const { data: breaks, error: breaksError } = await supabase
      .from("breaks")
      .select("*")
      .in(
        "availability_id",
        availabilities.map((a) => a.id)
      );

    if (breaksError) throw breaksError;

    const result = availabilities.map((avail) => ({
      ...avail,
      start_time: convertTime(avail.start_time, timezone, false),
      end_time: convertTime(avail.end_time, timezone, false),
      breaks: breaks
        .filter((br) => br.availability_id === avail.id)
        .map((br) => ({
          ...br,
          start_time: convertTime(br.start_time, timezone, false),
          end_time: convertTime(br.end_time, timezone, false),
        })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();

  try {
    const { business_id, timezone = "UTC", availabilities } = body;

    if (!timezone) {
      return NextResponse.json(
        { error: "timezone is required" },
        { status: 400 }
      );
    }

    const processedAvailabilities = await Promise.all(
      availabilities.map(async (avail) => {
        const startTimeUTC = convertTime(avail.start_time, timezone, true);
        const endTimeUTC = convertTime(avail.end_time, timezone, true);

        return {
          ...avail,
          start_time: startTimeUTC,
          end_time: endTimeUTC,
          breaks: await Promise.all(
            avail.breaks.map(async (br) => ({
              ...br,
              start_time: convertTime(br.start_time, timezone, true),
              end_time: convertTime(br.end_time, timezone, true),
            }))
          ),
        };
      })
    );

    const { data: upsertedAvailabilities, error: upsertError } = await supabase
      .from("availability")
      .upsert(
        processedAvailabilities.map(({ breaks, ...avail }) => avail),
        { onConflict: "id" }
      )
      .select();

    if (upsertError) throw upsertError;

    const { data: existingBreaks, error: existingBreaksError } = await supabase
      .from("breaks")
      .select("*")
      .in(
        "availability_id",
        upsertedAvailabilities.map((a) => a.id)
      );

    if (existingBreaksError) throw existingBreaksError;

    const allNewBreaks = processedAvailabilities.flatMap((avail) => {
      const availability = upsertedAvailabilities.find(
        (a) => a.weekday === avail.weekday
      );
      if (!availability) return [];

      return avail.breaks.map((br) => {
        const isNewBreak = br.id?.startsWith?.("temp-");

        return {
          ...(isNewBreak ? {} : { id: br.id }),
          availability_id: availability.id,
          start_time: br.start_time,
          end_time: br.end_time,
        };
      });
    });

    const newBreaks = allNewBreaks.filter((br) => !br.id);
    const existingBreaksToUpdate = allNewBreaks.filter((br) => br.id);

    const breaksToDelete = existingBreaks.filter(
      (eb) => !allNewBreaks.some((nb) => nb.id === eb.id)
    );

    if (breaksToDelete.length > 0) {
      const { error: deleteBreaksError } = await supabase
        .from("breaks")
        .delete()
        .in(
          "id",
          breaksToDelete.map((b) => b.id)
        );

      if (deleteBreaksError) throw deleteBreaksError;
    }

    if (existingBreaksToUpdate.length > 0) {
      const { error: updateBreaksError } = await supabase
        .from("breaks")
        .upsert(existingBreaksToUpdate);

      if (updateBreaksError) throw updateBreaksError;
    }

    let insertedBreaks = [];
    if (newBreaks.length > 0) {
      const { data: inserted, error: insertBreaksError } = await supabase
        .from("breaks")
        .insert(newBreaks)
        .select();

      if (insertBreaksError) throw insertBreaksError;
      insertedBreaks = inserted;
    }

    const allBreaks = [...existingBreaksToUpdate, ...insertedBreaks];

    const result = upsertedAvailabilities.map((avail) => ({
      ...avail,
      start_time: convertTime(avail.start_time, timezone, false),
      end_time: convertTime(avail.end_time, timezone, false),
      breaks: allBreaks
        .filter((br) => br.availability_id === avail.id)
        .map((br) => ({
          ...br,
          start_time: convertTime(br.start_time, timezone, false),
          end_time: convertTime(br.end_time, timezone, false),
        })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving availability:", error);
    return NextResponse.json(
      { error: "Failed to save availability" },
      { status: 500 }
    );
  }
}
