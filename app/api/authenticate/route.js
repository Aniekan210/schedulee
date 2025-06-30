import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Trial check logic
  const trialDays = 14;
  const now = new Date();
  const trialEnd = new Date(
    new Date(session.user.created_at).setDate(
      new Date(session.user.created_at).getDate() + trialDays
    )
  );
  const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / 86400000));

  return NextResponse.json({
    hasPaid: session.user.user_metadata?.has_paid || false,
    daysLeft,
  });
}
