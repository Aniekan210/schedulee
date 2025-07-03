// app/success/page.js
'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  if (!message) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-sm p-8 rounded-xl border border-gray-100 shadow-sm text-center bg-white">
          <p className="text-red-500 mb-6">No success message provided</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const decodedMessage = decodeURIComponent(message);

  return (
    <div className="w-full max-w-sm p-8 rounded-xl border border-gray-100 shadow-sm bg-white">
      <div className="flex flex-col items-center space-y-5 text-center">
        {/* Animated Checkmark */}
        <div className="p-3 rounded-full bg-blue-50 mb-1 animate-pulse">
          <CheckCircle2 className="w-9 h-9 text-blue-500" strokeWidth={1.75} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Success!</h2>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {decodedMessage}
        </p>

        <div className="flex flex-col space-y-3 w-full mt-8">
          <Link
            href="/login"
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Continue to Login
          </Link>
          <Link
            href="/"
            className="px-5 py-2 text-blue-500 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
          >
            ← Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      {/* Branding Logo */}
      <div className="mb-10 sm:mb-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
          <Image
            src="/logo.avif"
            alt="Schedulee"
            fill
            className="rounded-lg object-contain"
          />
        </div>
      </div>

      {/* Suspense Boundary */}
      <Suspense fallback={
        <div className="w-full max-w-sm p-8 rounded-xl border border-gray-100 shadow-sm text-center bg-white">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-9 w-9 rounded-full bg-gray-200"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg mt-6"></div>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>

      {/* Subtle Footer */}
      <p className="mt-12 text-xs text-gray-400">
        © {new Date().getFullYear()} Schedulee
      </p>
    </div>
  );
}