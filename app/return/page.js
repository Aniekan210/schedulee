"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { stripe } from "@/lib/stripe"; // Only if this is a client-safe stripe helper (see notes below)
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function ReturnPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCheckoutResult = async () => {
      const session_id = searchParams.get("session_id");

      if (!session_id) {
        router.replace(
          `/error?message=${encodeURIComponent(
            "Missing session_id in the URL"
          )}`
        );
        return;
      }

      try {
        const res = await fetch(`/api/stripe-session?session_id=${session_id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Unable to retrieve session");

        const { status, customer_email } = data;

        if (status === "open") {
          router.replace(
            `/error?message=${encodeURIComponent(
              "Your payment has failed or was cancelled"
            )}`
          );
          return;
        }

        if (status === "complete") {
          const { error } = await supabase.auth.updateUser({
            data: { is_paid: true },
          });

          if (error) {
            router.replace(
              `/error?message=${encodeURIComponent(error.message)}`
            );
            return;
          }

          router.replace(
            `/success?message=${encodeURIComponent(
              `Your payment was successful. A confirmation has been sent to ${customer_email}`
            )}`
          );
        }
      } catch (err) {
        router.replace(
          `/error?message=${encodeURIComponent(
            err.message || "Something went wrong"
          )}`
        );
      }
    };

    handleCheckoutResult();
  }, [searchParams, router]);

  return <div className="text-center animate-pulse text-gray-500 mt-12">Processing payment...</div>;
}

export default function ReturnPage() {
  return (
    <Suspense fallback={<div className="text-center mt-12">Loading...</div>}>
      <ReturnPageContent />
    </Suspense>
  );
}
