// app/api/authenticate/route.js
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trialDays = 30;
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const daysElapsed = Math.floor((now - createdAt) / 86400000);
    const daysLeft = Math.max(0, trialDays - daysElapsed);

    return NextResponse.json({
      user,
      hasPaid: user.user_metadata?.is_paid || false,
      daysLeft,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
