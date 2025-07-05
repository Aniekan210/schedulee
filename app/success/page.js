"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const decodedMessage = message ? decodeURIComponent(message) : null;

  return (
    <div className="w-full max-w-sm bg-white shadow-md rounded-2xl border border-blue-100 px-6 py-8 text-center">
      {!decodedMessage ? (
        <>
          <p className="text-red-500 mb-6">No success message provided</p>
          <Link
            href="/"
            className="inline-block mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            ← Go back home
          </Link>
        </>
      ) : (
        <>
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-blue-100">
              <CheckCircle2 className="w-7 h-7 text-blue-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Success!</h2>
          <p className="mt-2 text-sm text-gray-600">{decodedMessage}</p>

          <div className="mt-6 space-y-2">
            <Link
              href="/login"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="block w-full text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 py-16">
      {/* Logo + Branding */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 relative">
          <Image
            src="/logo.avif"
            alt="Schedulee Logo"
            fill
            className="object-contain rounded-md"
          />
        </div>
        <span className="text-lg font-bold text-gray-800">Schedulee.app</span>
      </div>

      {/* Content with Suspense */}
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-white shadow-md rounded-2xl px-6 py-8 text-center">
            <div className="space-y-4 animate-pulse">
              <div className="h-10 w-10 mx-auto bg-gray-200 rounded-full" />
              <div className="h-6 w-2/3 mx-auto bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-lg" />
            </div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-400">
        © {new Date().getFullYear()} Schedulee
      </p>
    </div>
  );
}
