"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function CheckoutLayout({ children }) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/authenticate");
        if (!res.ok) {
          // Unauthenticated
          window.location.href = "/login";
          return;
        }

        const data = await res.json();

        if (data.hasPaid) {
          // Already paid
          window.location.href = "/dashboard/bookings";
        }
      } catch (error) {
        console.error("Authentication error:", error);
        window.location.href = "/login";
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3">
            <Image
              width={40}
              height={40}
              src="/logo.avif"
              alt="Schedulee.app Logo"
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-gray-900">
              Schedulee.app
            </span>
          </a>
          <a
            href="/login"
            className="text-gray-600 hover:text-blue-500 transition"
          >
            Back to Login
          </a>
        </div>
      </header>

      {/* Checkout Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
