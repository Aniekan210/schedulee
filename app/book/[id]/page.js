"use client";

import BookingForm from "@/components/ui/booking-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const { id: username } = useParams();
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        const response = await fetch(`/api/link?username=${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch business ID");
        }
        const data = await response.json();
        setBusinessId(data.id);
      } catch (err) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchBusinessId();
    }
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!businessId) {
    return <div>No business found</div>;
  }

  return <BookingForm business_id={businessId} />;
}
