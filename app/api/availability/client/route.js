import { supabase } from "@/lib/supabase/client";
import { DateTime } from "luxon";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const business_id = searchParams.get("business_id");
  const rawDate = searchParams.get("date");
  const userTimezone = searchParams.get("timezone") || "UTC";
  const businessTimezone = searchParams.get("business_timezone") || "UTC";

  if (!business_id || !rawDate) {
    return new Response(
      JSON.stringify({
        error: "Missing required parameters: business_id or date",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const userDate = DateTime.fromISO(rawDate, { zone: userTimezone });
  if (!userDate.isValid) {
    return new Response(
      JSON.stringify({ error: "Invalid date format (expected YYYY-MM-DD)" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get UTC range for the user's full local day
  const utcStart = userDate.startOf("day").toUTC();
  const utcEnd = userDate.endOf("day").toUTC();

  // Use business timezone version of UTC start to query the override
  const businessLocalDate = utcStart.setZone(businessTimezone).toISODate();

  const weekday = userDate.toFormat("cccc").toLowerCase();
  const dateOnly = userDate.toISODate();

  try {
    const { data: override, error: overrideError } = await supabase
      .from("overrides")
      .select("*")
      .eq("business_id", business_id)
      .eq("date", businessLocalDate)
      .maybeSingle();

    if (overrideError) throw overrideError;

    if (override && override.is_available === false) {
      return new Response(
        JSON.stringify({
          availableTimes: [],
          reason: "business_closed",
          message: "Business is closed on this date via override.",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Get existing bookings in UTC
    const { data: existingBookings = [], error: bookingsError } = await supabase
      .from("bookings")
      .select("timestamp_utc")
      .eq("business_id", business_id)
      .gte("timestamp_utc", utcStart.toISO())
      .lt("timestamp_utc", utcEnd.toISO());

    if (bookingsError) throw bookingsError;

    const bookedMinutes = new Set(
      existingBookings.map((booking) => {
        const dt = DateTime.fromISO(booking.timestamp_utc, { zone: "utc" });
        return dt.hour * 60 + dt.minute;
      })
    );

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
            message: "No recurring business hours for this weekday.",
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

    // Generate all potential UTC slots
    const slots = generateTimeSlots(
      availabilityConfig.start_time,
      availabilityConfig.end_time,
      availabilityConfig.interval_minutes,
      breaks
    );

    // Filter out booked ones
    const availableSlots = slots.filter((slot) => {
      const [hour, minute] = slot.split(":").map(Number);
      const slotMinutes = hour * 60 + minute;
      return !bookedMinutes.has(slotMinutes);
    });

    // Convert each available time to the user's local timezone
    const convertedSlots = convertSlotsToUserTimezone(
      availableSlots,
      userDate,
      userTimezone
    );

    return new Response(
      JSON.stringify({
        availableTimes: convertedSlots,
        meta: {
          date: dateOnly,
          timezone: userTimezone,
          businessTimezone,
          weekday,
          business_id,
          totalSlots: slots.length,
          bookedSlots: existingBookings.length,
          availableSlots: convertedSlots.length,
          usingOverride: !!override?.is_available,
          intervalMinutes: availabilityConfig.interval_minutes,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 Error fetching availability:", error);
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

    // Exclude time if it's inside a break
    const isDuringBreak = breaks.some((b) => {
      const breakStart = b.start_time;
      const breakEnd = b.end_time;
      return timeStr >= breakStart && timeStr < breakEnd;
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

function convertSlotsToUserTimezone(slots, userDate, userTimezone) {
  const converted = slots.map((timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const utcSlot = DateTime.fromObject(
      {
        year: userDate.year,
        month: userDate.month,
        day: userDate.day,
        hour,
        minute,
      },
      { zone: "utc" }
    );
    return utcSlot.setZone(userTimezone).toFormat("HH:mm");
  });

  return converted;
}
