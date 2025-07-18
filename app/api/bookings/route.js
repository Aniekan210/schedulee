import { DateTime } from "luxon";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function convertToUTC(dateStr, timeStr, timezone) {
  const localDateTime = DateTime.fromISO(`${dateStr}T${timeStr}`, {
    zone: timezone,
  });
  return localDateTime.toUTC().toISO();
}

function convertFromUTC(timestampUtc, timezone) {
  const utcDateTime = DateTime.fromISO(timestampUtc, { zone: "utc" });
  const localDateTime = utcDateTime.setZone(timezone);
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

    // First get the count without pagination
    let countQuery = supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("business_id", user.id);

    // Apply the same filters to the count query
    switch (filter) {
      case "today": {
        const startUtc = today.toUTC().toISO();
        const endUtc = today.plus({ days: 1 }).toUTC().toISO();
        countQuery = countQuery
          .gte("timestamp_utc", startUtc)
          .lt("timestamp_utc", endUtc);
        break;
      }
      case "tomorrow": {
        const tomorrow = today.plus({ days: 1 });
        const startUtc = tomorrow.toUTC().toISO();
        const endUtc = tomorrow.plus({ days: 1 }).toUTC().toISO();
        countQuery = countQuery
          .gte("timestamp_utc", startUtc)
          .lt("timestamp_utc", endUtc);
        break;
      }
      case "next7": {
        const startUtc = today.toUTC().toISO();
        const nextWeek = today.plus({ days: 7 }).endOf("day");
        countQuery = countQuery
          .gte("timestamp_utc", startUtc)
          .lte("timestamp_utc", nextWeek.toUTC().toISO());
        break;
      }
      case "upcoming": {
        const startUtc = today.toUTC().toISO();
        countQuery = countQuery.gte("timestamp_utc", startUtc);
        break;
      }
      case "past30": {
        const pastDate = today.minus({ days: 30 });
        const todayEnd = today.endOf("day");
        countQuery = countQuery
          .gte("timestamp_utc", pastDate.toUTC().toISO())
          .lte("timestamp_utc", todayEnd.toUTC().toISO());
        break;
      }
      case "recent": {
        const recentDate = DateTime.now().minus({ days: 7 });
        countQuery = countQuery.gte("created_at", recentDate.toUTC().toISO());
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
          countQuery = countQuery
            .gte("timestamp_utc", startUtc)
            .lte("timestamp_utc", endUtc);
        }
        break;
      }
    }

    const { count } = await countQuery;

    // Now get the paginated data
    let dataQuery = supabase
      .from("bookings")
      .select("*")
      .eq("business_id", user.id)
      .order("timestamp_utc", { ascending: filter !== "recent" });

    // Reapply filters for the data query
    switch (filter) {
      case "today": {
        const startUtc = today.toUTC().toISO();
        const endUtc = today.plus({ days: 1 }).toUTC().toISO();
        dataQuery = dataQuery
          .gte("timestamp_utc", startUtc)
          .lt("timestamp_utc", endUtc);
        break;
      }
      case "tomorrow": {
        const tomorrow = today.plus({ days: 1 });
        const startUtc = tomorrow.toUTC().toISO();
        const endUtc = tomorrow.plus({ days: 1 }).toUTC().toISO();
        dataQuery = dataQuery
          .gte("timestamp_utc", startUtc)
          .lt("timestamp_utc", endUtc);
        break;
      }
      case "next7": {
        const startUtc = today.toUTC().toISO();
        const nextWeek = today.plus({ days: 7 }).endOf("day");
        dataQuery = dataQuery
          .gte("timestamp_utc", startUtc)
          .lte("timestamp_utc", nextWeek.toUTC().toISO());
        break;
      }
      case "upcoming": {
        const startUtc = today.toUTC().toISO();
        dataQuery = dataQuery.gte("timestamp_utc", startUtc);
        break;
      }
      case "past30": {
        const pastDate = today.minus({ days: 30 });
        const todayEnd = today.endOf("day");
        dataQuery = dataQuery
          .gte("timestamp_utc", pastDate.toUTC().toISO())
          .lte("timestamp_utc", todayEnd.toUTC().toISO());
        break;
      }
      case "recent": {
        const recentDate = DateTime.now().minus({ days: 7 });
        dataQuery = dataQuery
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
          dataQuery = dataQuery
            .gte("timestamp_utc", startUtc)
            .lte("timestamp_utc", endUtc);
        }
        break;
      }
    }

    // Apply pagination
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    const { data, error } = await dataQuery.range(from, to);

    if (error) throw error;

    const bookingsWithLocalTime = data.map((booking) => ({
      ...booking,
      ...convertFromUTC(booking.timestamp_utc, timezone),
    }));

    return NextResponse.json({
      bookings: bookingsWithLocalTime,
      totalCount: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / itemsPerPage),
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();

    const { timezone, id, ...bookingData } = await request.json();

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
    console.error(error);
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
