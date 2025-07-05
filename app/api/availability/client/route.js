// app/api/availability/client/route.js
import { supabase } from "@/lib/supabase/client";
import { DateTime } from "luxon";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const business_id = searchParams.get("business_id");
  const dateParam = searchParams.get("date");
  const timezone = searchParams.get("timezone") || "UTC";

  if (!business_id || !dateParam) {
    return new Response(
      JSON.stringify({
        error: "Missing required parameters: business_id or date",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const date = DateTime.fromISO(dateParam, { zone: timezone });
    if (!date.isValid) {
      return new Response(JSON.stringify({ error: "Invalid date format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const weekday = date.toFormat("cccc").toLowerCase(); // e.g. "monday"
    const dateOnly = date.toISODate(); // "YYYY-MM-DD"

    // 1. Check for override
    const { data: override, error: overrideError } = await supabase
      .from("overrides")
      .select("*")
      .eq("business_id", business_id)
      .eq("date", dateOnly)
      .maybeSingle();

    if (overrideError) throw overrideError;

    if (override && !override.is_available) {
      return new Response(
        JSON.stringify({
          availableTimes: [],
          reason: "business_closed",
          message: "Business is closed on this date",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Get existing bookings
    const { data: existingBookings = [], error: bookingsError } = await supabase
      .from("bookings")
      .select("timestamp_utc")
      .eq("business_id", business_id)
      .gte("timestamp_utc", `${dateOnly}T00:00:00Z`)
      .lt("timestamp_utc", `${dateOnly}T23:59:59Z`);

    if (bookingsError) throw bookingsError;

    const bookedMinutes = new Set(
      existingBookings.map((booking) => {
        const dt = DateTime.fromISO(booking.timestamp_utc, { zone: "utc" });
        return dt.hour * 60 + dt.minute;
      })
    );

    // 3. Get availability config
    let availabilityConfig = null;
    let breaks = [];

    if (override?.is_available) {
      availabilityConfig = {
        start_time: override.start_time,
        end_time: override.end_time,
        interval_minutes: override.interval_minutes || 30,
      };
    } else {
      const { data: availability, error: availabilityError } = await supabase
        .from("availability")
        .select("*")
        .eq("business_id", business_id)
        .eq("weekday", weekday)
        .eq("is_available", true)
        .maybeSingle();

      if (availabilityError) throw availabilityError;

      if (!availability) {
        return new Response(
          JSON.stringify({
            availableTimes: [],
            reason: "no_regular_hours",
            message: "No regular business hours for this weekday",
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      availabilityConfig = {
        start_time: availability.start_time,
        end_time: availability.end_time,
        interval_minutes: availability.interval_minutes || 30,
      };

      const { data: availabilityBreaks = [], error: breaksError } =
        await supabase
          .from("breaks")
          .select("*")
          .eq("availability_id", availability.id);

      if (breaksError) throw breaksError;
      breaks = availabilityBreaks;
    }

    const slots = generateTimeSlots(
      availabilityConfig.start_time,
      availabilityConfig.end_time,
      availabilityConfig.interval_minutes,
      breaks
    );

    const availableSlots = slots.filter((slot) => {
      const [hours, minutes] = slot.split(":").map(Number);
      const slotMinutes = hours * 60 + minutes;
      return !bookedMinutes.has(slotMinutes);
    });

    const timezoneSlots = convertSlotsToTimezone(
      availableSlots,
      dateOnly,
      timezone
    );

    return new Response(
      JSON.stringify({
        availableTimes: timezoneSlots,
        meta: {
          date: dateOnly,
          timezone,
          weekday,
          business_id,
          totalSlots: slots.length,
          bookedSlots: existingBookings.length,
          availableSlots: timezoneSlots.length,
          usingOverride: !!override?.is_available,
          intervalMinutes: availabilityConfig.interval_minutes,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching availability:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch availability",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function generateTimeSlots(startTime, endTime, intervalMinutes, breaks = []) {
  const slots = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeStr = `${String(currentHour).padStart(2, "0")}:${String(
      currentMin
    ).padStart(2, "0")}`;

    const isDuringBreak = breaks.some((b) => {
      return timeStr >= b.start_time && timeStr < b.end_time;
    });

    if (!isDuringBreak) {
      slots.push(timeStr);
    }

    currentMin += intervalMinutes;
    if (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
  }

  return slots;
}

function convertSlotsToTimezone(slots, dateStr, timezone) {
  return slots.map((slot) => {
    const [hour, minute] = slot.split(":").map(Number);
    const utcTime = DateTime.fromObject(
      {
        ...DateTime.fromISO(dateStr).toObject(),
        hour,
        minute,
      },
      { zone: "utc" }
    ).setZone(timezone);

    return utcTime.toFormat("HH:mm");
  });
}
