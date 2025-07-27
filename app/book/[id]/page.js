"use client";

import BookingForm from "@/components/ui/booking-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const { id: username } = useParams();
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const fetchBusinessId = async () => {
      const response = await fetch(`/api/link?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setBusinessId(data.id);
      }
    };

    if (username) {
      fetchBusinessId();
    }
  }, [username]);

  return <BookingForm business_id={businessId} />;
}
