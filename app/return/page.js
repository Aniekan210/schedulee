import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase/client";

export default async function ReturnPage({ searchParams }) {
  const session_id = searchParams?.session_id;

  if (!session_id) {
    redirect(`/error?message=${encodeURIComponent("Missing session_id")}`);
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent", "customer_details"],
    });
  } catch (err) {
    redirect(`/error?message=${encodeURIComponent("Invalid session ID")}`);
  }

  const { status, customer_details } = session;
  const customerEmail = customer_details?.email ?? "your email";

  if (status === "open") {
    redirect(
      `/error?message=${encodeURIComponent(
        "Your payment was cancelled or failed."
      )}`
    );
  }

  if (status === "complete") {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      redirect(
        `/error?message=${encodeURIComponent("User not authenticated.")}`
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { is_paid: true },
    });

    if (updateError) {
      redirect(`/error?message=${encodeURIComponent(updateError.message)}`);
    }

    redirect(
      `/success?message=${encodeURIComponent(
        `Your payment was successful. A confirmation has been sent to ${customerEmail}`
      )}`
    );
  }

  // fallback for unknown status
  redirect(`/error?message=${encodeURIComponent("Unknown payment status.")}`);
}
