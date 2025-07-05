import { DateTime } from "luxon";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function convertToUTC(dateStr, timeStr, timezone) {
  // Create a Luxon DateTime in the specified timezone
  const localDateTime = DateTime.fromISO(`${dateStr}T${timeStr}`, {
    zone: timezone,
  });

  // Convert to UTC and return as ISO string
  return localDateTime.toUTC().toISO();
}

function convertFromUTC(timestampUtc, timezone) {
  // Create a Luxon DateTime from UTC timestamp
  const utcDateTime = DateTime.fromISO(timestampUtc, { zone: "utc" });

  // Convert to the specified timezone
  const localDateTime = utcDateTime.setZone(timezone);

  // Format as date and time strings
  const dateStr = localDateTime.toISODate();
  const timeStr = localDateTime.toFormat("HH:mm");

  return { booking_date: dateStr, booking_time: timeStr };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "today";
  const page = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "5");
  const customDate = searchParams.get("customDate");
  const timezone = searchParams.get("timezone") || "UTC";

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = DateTime.now().setZone(timezone).startOf("day");

    let query = supabase
      .from("bookings")
      .select("*")
      .eq("business_id", user.id)
      .order("timestamp_utc", { ascending: true });

    switch (filter) {
      case "today": {
        const startUtc = today.toUTC().toISO();
        const endUtc = today.plus({ days: 1 }).toUTC().toISO();
        query = query
          .gte("timestamp_utc", startUtc)
          .lt("timestamp_utc", endUtc);
        break;
      }
      case "tomorrow": {
        const tomorrow = today.plus({ days: 1 });
        const startUtc = tomorrow.toUTC().toISO();
        const endUtc = tomorrow.plus({ days: 1 }).toUTC().toISO();
        query = query
          .gte("timestamp_utc", startUtc)
          .lt("timestamp_utc", endUtc);
        break;
      }
      case "next7": {
        const startUtc = today.toUTC().toISO();
        const nextWeek = today.plus({ days: 7 }).endOf("day");
        query = query
          .gte("timestamp_utc", startUtc)
          .lte("timestamp_utc", nextWeek.toUTC().toISO());
        break;
      }
      case "upcoming": {
        const startUtc = today.toUTC().toISO();
        query = query.gte("timestamp_utc", startUtc);
        break;
      }
      case "past30": {
        const pastDate = today.minus({ days: 30 });
        const todayEnd = today.endOf("day");
        query = query
          .gte("timestamp_utc", pastDate.toUTC().toISO())
          .lte("timestamp_utc", todayEnd.toUTC().toISO());
        break;
      }
      case "recent": {
        const recentDate = DateTime.now().minus({ days: 7 });
        query = query
          .gte("created_at", recentDate.toUTC().toISO())
          .order("created_at", { ascending: false });
        break;
      }
      case "custom": {
        if (customDate) {
          const startUtc = DateTime.fromISO(`${customDate}T00:00:00`, {
            zone: timezone,
          })
            .toUTC()
            .toISO();
          const endUtc = DateTime.fromISO(`${customDate}T23:59:59.999`, {
            zone: timezone,
          })
            .toUTC()
            .toISO();
          query = query
            .gte("timestamp_utc", startUtc)
            .lte("timestamp_utc", endUtc);
        }
        break;
      }
    }

    const { count } = await query.select("*", { count: "exact", head: true });

    const { data, error } = await query.range(
      (page - 1) * itemsPerPage,
      page * itemsPerPage - 1
    );

    if (error) throw error;

    // Convert UTC timestamps back to local date and time
    const bookingsWithLocalTime = data.map((booking) => ({
      ...booking,
      ...convertFromUTC(booking.timestamp_utc, timezone),
    }));

    return NextResponse.json({
      bookings: bookingsWithLocalTime,
      total: count,
      page,
      totalPages: Math.ceil(count / itemsPerPage),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();

    const { timezone, ...bookingData } = await request.json();

    // Validate required fields
    if (
      !bookingData.name ||
      !bookingData.phone_number ||
      !bookingData.booking_date ||
      !bookingData.booking_time
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert local date/time to UTC timestamp
    const timestamp_utc = convertToUTC(
      bookingData.booking_date,
      bookingData.booking_time.includes(":")
        ? bookingData.booking_time
        : `${bookingData.booking_time}:00`,
      timezone || "UTC"
    );

    // Create a new object without booking_date and booking_time
    const { booking_date, booking_time, ...cleanBookingData } = bookingData;

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          ...cleanBookingData,
          timestamp_utc,
        },
      ])
      .select();

    if (error) throw error;

    // Return the booking with local date/time
    const responseData = {
      ...data[0],
      ...convertFromUTC(data[0].timestamp_utc, timezone || "UTC"),
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, timezone, booking_date, booking_time, phone, ...rest } =
      await request.json();

    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("business_id", user.id)
      .single();

    if (!existingBooking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Convert local date/time to UTC timestamp if date/time are being updated
    let timestamp_utc = existingBooking.timestamp_utc;
    if (booking_date && booking_time) {
      timestamp_utc = convertToUTC(
        booking_date,
        booking_time.includes(":") ? booking_time : `${booking_time}:00`,
        timezone || "UTC"
      );
    }

    // Remove any deprecated fields that might be in the rest object
    const { booking_date: _, booking_time: __, ...cleanRest } = rest;

    const { data, error } = await supabase
      .from("bookings")
      .update({
        ...cleanRest,
        phone_number: phone,
        timestamp_utc,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    // Return the booking with local date/time
    const responseData = {
      ...data[0],
      ...convertFromUTC(data[0].timestamp_utc, timezone || "UTC"),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("business_id", user.id)
      .single();

    if (!existingBooking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
