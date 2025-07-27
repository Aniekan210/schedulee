import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const username = searchParams.get("username");

  // If username is provided, fetch the ID
  if (username) {
    const { data, error } = await supabase
      .from("link_map")
      .select("user_id")
      .eq("username", username)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Username not found" }, { status: 404 });
    }

    return NextResponse.json({ id: data.user_id });
  }

  // If ID is provided, fetch the username (original functionality)
  if (id) {
    const { data, error } = await supabase
      .from("link_map")
      .select("username")
      .eq("user_id", id)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    }

    return NextResponse.json({ customLink: data.username });
  }

  // If neither ID nor username is provided
  return NextResponse.json(
    { error: "Missing id or username parameter" },
    { status: 400 }
  );
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