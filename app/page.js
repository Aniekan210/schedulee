import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import ClientPage from "./client-page"

// Static data that doesn't require client-side rendering
const testimonials = [
  {
    quote: "schedulee.app has saved me hours each week. My clients love how easy it is to book, and I love having all my appointments in one place.",
    author: "Sarah K., Freelance Designer",
    stars: 5
  },
  {
    quote: "The no-login feature is a game changer. My older clients were struggling with other systems, but now they book with just a phone call's worth of information.",
    author: "Michael T., Consultant",
    stars: 4
  },
  {
    quote: "For $8.99/month, this is a no-brainer. I was paying triple for a more complex system I didn't need.",
    author: "Jessica L., Massage Therapist",
    stars: 5
  },
  {
    quote: "Setup took 10 minutes and I was accepting bookings the same day. The trial convinced me to stay.",
    author: "David R., Tutor",
    stars: 4
  },
  {
    quote: "My no-show rate dropped by 60% since using schedulee.app. The automated reminders are perfect.",
    author: "Emma S., Hair Stylist",
    stars: 5
  },
  {
    quote: "Finally a booking system that doesn't overwhelm my clients with accounts and logins. Simple and effective.",
    author: "James P., Photographer",
    stars: 4
  }
]

export default function Home() {
  return (
    <ClientPage testimonials={testimonials} />
  )
}