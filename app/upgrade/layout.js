"use client";

import Image from "next/image";

export default function CheckoutLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Clean Sticky Navbar */}
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
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
