import Image from "next/image";
import Link from "next/link";

export default function CancelPlanPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-md border border-gray-200 text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.avif"
            alt="Schedulee Logo"
            width={56}
            height={56}
            className="rounded-xl"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">Cancel Your Plan</h1>

        {/* Description */}
        <p className="text-gray-600 text-base">
          To cancel your plan, please email us at:
        </p>

        {/* Email Button */}
        <a
          href="mailto:support@schedulee.app"
          className="inline-block bg-blue-500 hover:bg-blue-600 transition text-white font-medium py-2 px-4 rounded-lg"
        >
          support@schedulee.app
        </a>

        {/* Navigation Links */}
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/"
            className="text-sm text-blue-500 hover:underline hover:text-blue-600"
          >
            ← Back to Home
          </Link>
          <Link
            href="/login"
            className="text-sm text-blue-500 hover:underline hover:text-blue-600"
          >
            Back to Login →
          </Link>
        </div>
      </div>
    </main>
  );
}
