import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("link_map")
    .select("username")
    .eq("user_id", id)
    .single();


  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customLink: data.username });
}

export async function POST(req) {
  const body = await req.json();
  const { id, username } = body;

  if (!id || !username) {
    return NextResponse.json(
      { error: "Missing id or username" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("link_map")
    .update({ username })
    .eq("user_id", id);

  if (error) {
    // Handle uniqueness constraint violation (PostgreSQL error code 23505)
    if (
      error.code === "23505" ||
      error.message.toLowerCase().includes("duplicate key value")
    ) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another one." },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Username updated to ${username}`,
  });
}
