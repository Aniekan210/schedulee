"use client";

import BookingForm from "@/components/ui/booking-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const { id: username } = useParams();
  const [businessId, setBusinessId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/link?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setBusinessId(data.id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchBusinessId();
    } else {
      setIsLoading(false);
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <BookingForm business_id={businessId} />;
}
