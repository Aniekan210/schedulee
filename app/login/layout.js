export const metadata = {
  title: "Login | Schedulee.app - Access Your Dashboard",
  description:
    "Log in to your Schedulee.app account to manage your availability, view bookings, and customize your booking page.",
  alternates: {
    canonical: "/login",
  },
  keywords: [
    "login to booking platform",
    "Schedulee login",
    "access booking dashboard",
    "appointment scheduler login",
    "freelancer booking tool login",
    "small business booking login",
    "sign in to Schedulee",
    "manage bookings online",
    "login to scheduling app",
    "access appointment calendar",
    "business booking page login",
    "dashboard for booking software",
    "scheduling system access",
    "login to appointment app",
    "log in to client scheduling platform",
  ],
  openGraph: {
    title: "Login | Schedulee.app - Access Your Dashboard",
    description:
      "Access your Schedulee.app dashboard to manage appointments, availability, and your booking page settings.",
    url: "https://schedulee.app/login",
    images: [
      {
        url: "https://schedulee.app/logo.png",
        width: 1200,
        height: 1200,
        alt: "Schedulee.app Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Schedulee.app - Access Your Dashboard",
    description:
      "Log in to Schedulee.app to manage your bookings, availability, and more.",
    images: "https://schedulee.app/logo.png",
  },
};

export default function LoginLayout({ children }) {
  return <>{children}</>;
}
