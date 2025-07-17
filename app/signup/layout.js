export const metadata = {
  title: "Sign Up | Schedulee.app - Get Started in Seconds",
  description:
    "Create your Schedulee.app account and start accepting bookings in minutes. No credit card required for the free trial.",
  alternates: {
    canonical: "/signup",
  },
  keywords: [
    "sign up for online booking app",
    "create scheduling account",
    "start free trial booking software",
    "no credit card booking tool",
    "cheap booking app free trial",
    "solo business appointment scheduler",
    "quick setup scheduling tool",
    "freelancer scheduling signup",
    "free booking page setup",
    "best booking platform for small business",
    "instant appointment booking setup",
    "30 day free booking app trial",
    "easy client booking software",
    "affordable appointment app signup",
    "simple booking software for beginners",
    "scheduling software with free trial",
    "create free booking page",
    "online booking system no payment required",
    "appointment scheduler without login",
    "sign up for Schedulee app",
  ],
  openGraph: {
    title: "Sign Up | Schedulee.app - Get Started in Seconds",
    description:
      "Create your account and start accepting bookings in minutes. 30 day Free Trial.",
    url: "https://schedulee.app/signup",
    images: [
      {
        url: "https://schedulee.app/logo.png", // Consider creating a dedicated signup OG image
        width: 1200,
        height: 1200, // Rectangular for better OG display
        alt: "Schedulee.app Sign Up",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Schedulee.app - Get Started in Seconds",
    description:
      "Create your account and start accepting bookings in minutes. 30 day Free Trial.",
    images: "https://schedulee.app/logo.png",
  },
};

export default function SignupLayout({ children }) {
  return <>{children}</>;
}
