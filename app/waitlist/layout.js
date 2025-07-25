export const metadata = {
  title: "Join the Waitlist | Schedulee.app – Be the First to Know",
  description:
    "Sign up for the Schedulee.app waitlist and get early access to our powerful booking tool built for solo businesses and freelancers.",
  alternates: {
    canonical: "/wait-list",
  },
  keywords: [
    "join schedulee waitlist",
    "booking app early access",
    "waitlist for scheduling software",
    "solo business scheduling tool",
    "freelancer appointment booking",
    "get notified booking software launch",
    "sign up for schedulee early access",
    "affordable booking app coming soon",
    "simple appointment scheduler preview",
    "booking software waitlist form",
    "exclusive access scheduling app",
    "small business booking tool early access",
    "be first to try schedulee",
    "early user booking platform",
    "new appointment app waitlist",
    "best upcoming booking software",
    "schedulee early invite",
    "get early access booking page",
    "join now schedulee waitlist",
    "booking software for freelancers",
  ],
  openGraph: {
    title: "Join the Waitlist | Schedulee.app – Be the First to Know",
    description:
      "Sign up for early access and be the first to experience our easy-to-use booking platform. Designed for solo businesses.",
    url: "https://schedulee.app/wait-list",
    images: [
      {
        url: "https://schedulee.app/logo.png", // You can replace this with a custom waitlist OG image if desired
        width: 1200,
        height: 1200,
        alt: "Schedulee.app Waitlist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Waitlist | Schedulee.app – Be the First to Know",
    description:
      "Sign up for early access and be the first to experience our easy-to-use booking platform. Designed for solo businesses.",
    images: "https://schedulee.app/logo.png",
  },
};

export default function WaitListLayout({ children }) {
  return <>{children}</>;
}
