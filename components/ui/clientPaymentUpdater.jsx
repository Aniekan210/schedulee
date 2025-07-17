// components/ClientPaymentUpdater.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientPaymentUpdater({ customerEmail }) {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/payment", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        window.location.href = 
          `/success?message=${encodeURIComponent(
            `Your payment was successful. A confirmation has been sent to ${customerEmail}`
          )}`;
      } catch (error) {
        window.location.href = `/error?message=${encodeURIComponent(error.message)}`;
      }
    };

    run();
  }, [customerEmail, router]);

  return <p className="text-center py-10">Finalizing your payment...</p>;
}
