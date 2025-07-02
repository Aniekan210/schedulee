import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getDateRangeForDay(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // start of day

  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // end of day

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "today";
  const page = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "5");
  const customDate = searchParams.get("customDate");

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    let query = supabase
      .from("bookings")
      .select("*")
      .eq("business_id", user.id)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    switch (filter) {
      case "today": {
        const { start, end } = getDateRangeForDay(today);
        query = query.gte("booking_date", start).lte("booking_date", end);
        break;
      }

      case "tomorrow": {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const { start, end } = getDateRangeForDay(tomorrow);
        query = query.gte("booking_date", start).lte("booking_date", end);
        break;
      }

      case "next7": {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const { start: startToday } = getDateRangeForDay(today);
        const { end: endNextWeek } = getDateRangeForDay(nextWeek);
        query = query.gte("booking_date", startToday).lte("booking_date", endNextWeek);
        break;
      }

      case "upcoming": {
        const { start: startToday } = getDateRangeForDay(today);
        query = query.gte("booking_date", startToday);
        break;
      }

      case "past30": {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 30);
        const { start: startPast } = getDateRangeForDay(pastDate);
        const { end: endToday } = getDateRangeForDay(today);
        query = query.gte("booking_date", startPast).lte("booking_date", endToday);
        break;
      }

      case "recent": {
        const recentDate = new Date(today);
        recentDate.setDate(today.getDate() - 7);
        query = query
          .gte("created_at", recentDate.toISOString())
          .order("created_at", { ascending: false });
        break;
      }

      case "custom": {
        if (customDate) {
          const date = new Date(customDate);
          const { start, end } = getDateRangeForDay(date);
          query = query.gte("booking_date", start).lte("booking_date", end);
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

    return NextResponse.json({
      bookings: data,
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bookingData = await request.json();

    // Validate required fields
    if (!bookingData.name || !bookingData.phone_number || !bookingData.booking_date || !bookingData.booking_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure business_id matches the authenticated user
    if (bookingData.business_id && bookingData.business_id !== user.id) {
      return NextResponse.json(
        { error: "Invalid business_id" },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          ...bookingData,
          business_id: user.id, // Override with authenticated user's ID
          booking_time: bookingData.booking_time.includes(':')
            ? bookingData.booking_time
            : `${bookingData.booking_time}:00`, // Ensure time format
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
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

    const { id, date, time, phone, ...rest } = await request.json();

    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("business_id", user.id)
      .single();

    if (!existingBooking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const { data, error } = await supabase
      .from("bookings")
      .update({
        ...rest,
        phone_number: phone,
        booking_date: date,
        booking_time: `${time}:00`,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
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
