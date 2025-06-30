// app/api/authenticate/route.js
import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // Explicit session validity check
    if (error || !session || !session.user || !session.access_token) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      );
    }

    const user = session.user;

    // Fixed trial logic
    const trialDays = 14;
    const now = new Date();
    const createdAt = new Date(user.created_at);

    const daysElapsed = Math.floor(
      (now.getTime() - createdAt.getTime()) / 86400000
    );
    const daysLeft = Math.max(0, Math.min(trialDays, trialDays - daysElapsed));

    const trialEnd = new Date(createdAt.getTime() + trialDays * 86400000);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      },
      hasPaid: user.user_metadata?.has_paid || false,
      daysLeft,
      trialEnd: trialEnd.toISOString(),
    });
  } catch (error) {
    console.error("Error in session route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
