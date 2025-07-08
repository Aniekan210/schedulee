// app/privacy/layout.js
import PolicyNav from "@/components/ui/policyNav"

export const metadata = {
  title: "Privacy Policy | Schedulee.app",
  description:
    "Learn how Schedulee.app collects, uses, and protects your personal data. Your privacy matters to us.",
  keywords: [
    "Schedulee privacy policy",
    "booking app privacy",
    "how Schedulee uses your data",
    "data protection for booking software",
    "appointment app GDPR policy",
    "privacy terms for solo business tools",
    "client data privacy Schedulee",
    "how Schedulee handles user info",
    "secure appointment scheduling",
    "privacy in small business booking platforms"
  ],
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Schedulee.app",
    description:
      "Understand how Schedulee.app protects your personal data and respects your privacy.",
    url: "https://schedulee.app/privacy",
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
    title: "Privacy Policy | Schedulee.app",
    description:
      "Read the Schedulee.app Privacy Policy to learn how we protect your data and respect your privacy.",
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

export default function PrivacyLayout({ children }) {
  return (
    <div className="bg-white min-h-screen">
      <PolicyNav />
      {children}
    </div>
  );
}
