// app/terms/layout.js
import PolicyNav from "@/components/ui/policyNav";

export const metadata = {
  title: "Terms of Service | Schedulee.app",
  description:
    "Review the terms and conditions for using Schedulee.app. Understand your rights, responsibilities, and our service agreement.",
  keywords: [
    "Schedulee terms of service",
    "booking app terms and conditions",
    "appointment scheduling app terms",
    "user agreement Schedulee.app",
    "Schedulee SaaS terms",
    "terms for solo business booking software",
    "service policy for scheduling tool",
    "Schedulee user policy",
    "online appointment tool legal terms",
    "business booking software agreement",
  ],
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Schedulee.app",
    description:
      "Understand the legal terms for using Schedulee.app, our responsibilities, and your rights as a user.",
    url: "https://schedulee.app/terms",
    siteName: "Schedulee.app",
    images: [
      {
        url: "https://schedulee.app/logo.png",
        width: 1200,
        height: 1200,
        alt: "Schedulee.app Logo",
      },
    ],
    locale: "en_CA",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Schedulee.app",
    description:
      "Read the terms and conditions for using Schedulee.app and learn about your rights as a user.",
    images: ["https://schedulee.app/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function TermsLayout({ children }) {
  return (
    <div className="bg-white min-h-screen">
      <PolicyNav />
      {children}
    </div>
  );
}
