"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const decodedMessage = message ? decodeURIComponent(message) : null;

  return (
    <div
      className="
        w-full max-w-sm bg-white shadow-lg rounded-3xl border border-red-200
        px-8 py-10 text-center
        relative
        overflow-hidden
      "
      style={{ boxShadow: "0 8px 30px rgba(239, 68, 68, 0.3)" }}
    >
      {!decodedMessage ? (
        <>
          <p className="text-red-600 mb-6 font-semibold text-lg">
            No error message provided
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-red-600 hover:text-red-700 font-semibold transition"
          >
            ← Go back home
          </Link>
        </>
      ) : (
        <>
          <div
            className="
              w-20 h-20 mx-auto flex items-center justify-center rounded-full
              bg-gradient-to-tr from-red-400 to-red-600
              shadow-lg
              animate-pulse-slow
            "
            aria-hidden="true"
          >
            <XCircle className="w-10 h-10 text-white drop-shadow-lg" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mt-6 mb-2">
            Error
          </h2>

          <p className="mt-2 text-base text-gray-700 max-w-xs mx-auto leading-relaxed">
            {decodedMessage}
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="
                block w-full
                bg-gradient-to-r from-red-600 to-red-500
                hover:from-red-700 hover:to-red-600
                text-white text-lg font-semibold
                py-3 rounded-2xl shadow-md
                transition
                focus:outline-none focus:ring-4 focus:ring-red-300
              "
            >
              Back to Login
            </Link>

            <Link
              href="/"
              className="
                block w-full text-center
                text-red-600 hover:text-red-700 font-semibold
                text-lg
                transition
              "
            >
              ← Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center
        bg-gradient-to-b from-red-50 via-white to-red-50
        px-6 sm:px-8 py-20
      "
    >
      {/* Logo + Branding */}
      <div className="mb-12 flex items-center gap-4 select-none">
        <div className="w-12 h-12 relative rounded-xl overflow-hidden">
          <Image
            src="/logo.avif"
            alt="Schedulee Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          Schedulee.app
        </span>
      </div>

      {/* Content with Suspense */}
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-white shadow-lg rounded-3xl px-8 py-10 text-center animate-pulse">
            <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full mb-6" />
            <div className="h-6 w-3/4 mx-auto bg-gray-200 rounded mb-3" />
            <div className="h-4 w-full mx-auto bg-gray-200 rounded mb-6" />
            <div className="h-12 w-full bg-gray-200 rounded-lg" />
          </div>
        }
      >
        <ErrorContent />
      </Suspense>

      {/* Footer */}
      <p className="mt-16 text-xs text-gray-400 select-none">
        © {new Date().getFullYear()} Schedulee.app
      </p>
    </div>
  );
}
