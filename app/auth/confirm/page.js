"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function VerifyPage() {
  useEffect(() => {
    const runVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token_hash = urlParams.get("token_hash");
      const type = urlParams.get("type") || null;
      const next = urlParams.get("next") || "/";

      if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({
          type,
          token_hash,
        });

        if (error) {
          window.location.href = `/error?message=${encodeURIComponent(
            error.message
          )}`;
          return;
        }

        // Set session on client side
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        window.location.href = next;
      } else {
        // fallback redirect
        window.location.href = next;
      }
    };

    runVerification();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg animate-pulse text-gray-600">
        Verifying, please wait...
      </p>
    </div>
  );
}
