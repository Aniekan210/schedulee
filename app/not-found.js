"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <Image
        src="/logo.avif"
        alt="Schedulee Logo"
        width={64}
        height={64}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
        >
          Back to Home
        </Link>
        <Link
          href="/login"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-xl transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
