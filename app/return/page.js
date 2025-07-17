// app/return/page.jsx (server)
import { stripe } from "@/lib/stripe";
import ClientPaymentUpdater from "@/components/ui/clientPaymentUpdater";

export default async function ReturnPage({ searchParams }) {
  const session_id = searchParams.session_id;

  if (!session_id) {
    redirect(`/error?message=Missing session_id`);
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent", "customer_details"],
    });
  } catch (err) {
    redirect(`/error?message=Invalid session ID`);
  }

  if (session.status === "open") {
    redirect(`/error?message=Your payment was cancelled or failed.`);
  }

  // Render client component that calls /api/payment
  return <ClientPaymentUpdater customerEmail={session.customer_details?.email} />;
}
