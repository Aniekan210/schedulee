import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Schedulee.app | Modern Booking & Scheduling Platform",
  description:
    "Simplify your scheduling process with Schedulee.app - The intuitive booking platform for businesses and professionals.",
  metadataBase: new URL("https://schedulee.app"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "online booking system",
    "cheap scheduling software",
    "appointment booking for solo business",
    "freelancer booking app",
    "small business scheduling tool",
    "simple booking system",
    "affordable booking software",
    "no login appointment booking",
    "easy booking page creator",
    "calendar app for small business",
    "solo entrepreneur tools",
    "side hustle booking tool",
    "appointment scheduler for freelancers",
    "automatic appointment reminders",
    "mobile-friendly booking platform",
    "online scheduling for consultants",
    "booking website without coding",
    "bookings for personal trainers",
    "coaching business booking system",
    "beauty salon appointment app",
    "appointment app with free trial",
    "Stripe booking integration",
    "small team calendar sharing",
    "self-employed appointment app",
    "client booking without sign-up",
  ],
  openGraph: {
    title: "Schedulee.app | Modern Booking & Scheduling Platform",
    description:
      "Simplify your scheduling process with Schedulee.app - The intuitive booking platform for businesses and professionals.",
    url: "https://schedulee.app",
    siteName: "Schedulee.app",
    images: [
      {
        url: "https://schedulee.app/logo.png",
        width: 600,
        height: 600,
        alt: "Schedulee.app Logo",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedulee.app | Modern Booking & Scheduling Platform",
    description:
      "Simplify your scheduling process with Schedulee.app - The intuitive booking platform for businesses and professionals.",
    images: {
      url: "https://schedulee.app/logo.png",
      alt: "Schedulee.app Logo",
      width: 1200,
      height: 1200,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" sizes="any" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Schedulee.app",
              description: "Online booking and scheduling platform",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "8.99",
                priceCurrency: "CAD",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
