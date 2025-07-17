"use server";

import { stripe } from "../../lib/stripe";

export async function fetchClientSecret() {
  try {
    const price_id =
      process.env.NODE_ENV === "development"
        ? "price_1RllBOHVBc6jypLZau5D6cxA"
        : "price_1RiVlnHVBc6jypLZNs5z8XiW";

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [{ price: price_id, quantity: 1 }],
      mode: "subscription",
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: false },
    });

    return session.client_secret;
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    throw new Error("Stripe session creation failed");
  }
}
