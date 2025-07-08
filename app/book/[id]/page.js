"use client";

import BookingForm from "@/components/ui/booking-form";
import { useParams } from "next/navigation";




export default function BookingPage() {
  const { id: business_id } = useParams();
  
  return(
    <BookingForm business_id={business_id} />
  );
}