"use client";

import DashboardSidebar from "@/components/ui/customSideBar";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head"; // import Head to use Next.js metadata handling

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>Dashboard | Schedulee.app - Manage Your Bookings</title>
        <meta
          name="description"
          content="Access your Schedulee dashboard to manage your bookings, availability, and boooking form with ease."
        />
        <meta
          name="keywords"
          content="Schedulee dashboard, Schedulee.app dashboard, appointment scheduling, client booking, calendar management, schedule app"
        />
        <meta name="author" content="Schedulee" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Schedulee.app Dashboard" />
        <meta
          property="og:description"
          content="Manage your bookings, clients, and availability with the Schedulee.app dashboard."
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Schedulee.app Dashboard" />
        <meta
          name="twitter:description"
          content="Manage your bookings, clients, and availability with the Schedulee.app dashboard."
        />
        <meta name="twitter:image" content="/logo.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <AuthContent>{children}</AuthContent>
      </AuthProvider>
    </>
  );
}

function AuthContent({ children }) {
  const { hasPaid, daysLeft, isLoading } = useAuth();

  return isLoading ? (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-24 h-24 border-8 border-white border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  ) : (
    <main className="w-screen h-screen overflow-hidden flex [flex-flow:row_nowrap] m-0 p-0">
      <DashboardSidebar isPaid={hasPaid} trialDays={daysLeft} />
      <div className="w-full h-full overflow-x-hidden overflow-y-auto">
        {children}
        <Toaster />
      </div>
    </main>
  );
}
