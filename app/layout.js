import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    "small business scheduling tool",
    "simple booking system",
    "affordable booking software",
    "no login appointment booking",
    "easy booking page creator",
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
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`
          !function(e){if(!window.pintrk){window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
            n=window.pintrk;n.queue=[],n.version="3.0";var
            t=document.createElement("script");t.async=!0,t.src=e;var
            r=document.getElementsByTagName("script")[0];
            r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
          pintrk('load', '2614343114309', {em: '<user_email_address>'});
          pintrk('page');
        `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://ct.pinterest.com/v3/?event=init&tid=2614343114309&pd[em]=<hashed_email_address>&noscript=1"
          />
        </noscript>
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
        <Script id="metricool-tracker" strategy="afterInteractive">
          {`
    function loadScript(a){
      var b=document.getElementsByTagName("head")[0],
          c=document.createElement("script");
      c.type="text/javascript";
      c.src="https://tracker.metricool.com/resources/be.js";
      c.onreadystatechange = a;
      c.onload = a;
      b.appendChild(c);
    }
    loadScript(function(){
      beTracker.t({hash:"681b449deb390249f6f426ab0a05beab"});
    });
  `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <SpeedInsights />
    </html>
  );
}
