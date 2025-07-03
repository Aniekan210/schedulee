"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from "@/components/ui/forgotPasswordForm";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const businessName = formData.get("businessName");
    const acceptedTerms = formData.get("acceptedTerms") === "on";

    if (!acceptedTerms) {
      setError("You must accept the terms and privacy policy");
      setLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, business_name: businessName }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();

      if (data.success) {
        setEmailSent(email);
        setSuccess(true);
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (err) {
      setError(
        err.name === "AbortError"
          ? "Request timed out. Please try again."
          : err.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sb-code-verifier");
    }

    const { url } = await fetch("/api/auth/google").then((res) => res.json());
    if (url != "") window.location.href = url;
  };

  return (
    <>
      {
        showForgotPassword ? (
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
        ) : (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg rounded-xl border border-gray-100">
              <CardHeader className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Image
                    src="/logo.avif"
                    alt="Schedulee Logo"
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {success ? "Check your email" : "Create your account"}
                </CardTitle>
                <CardDescription className="text-gray-500 mt-2">
                  {success
                    ? `We've sent a confirmation link to ${emailSent}. Please check your inbox to verify your email.`
                    : "Start managing your bookings in minutes"}
                </CardDescription>
              </CardHeader>

              {!success ? (
                <CardContent className="px-8 pb-6">
                  <Button
                    onClick={handleGoogleSignup}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 mb-6 h-11 rounded-lg border-gray-300 hover:bg-gray-50"
                    disabled={loading}
                  >
                    <GoogleIcon />
                    Continue with Google
                  </Button>

                  <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="mx-4 text-sm text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-gray-700">
                        Business Name
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        type="text"
                        placeholder="Your Business Name"
                        className="h-11 rounded-lg focus:ring-blue-500 border-gray-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 rounded-lg focus:ring-blue-500 border-gray-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-11 rounded-lg focus:ring-blue-500 border-gray-300"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="acceptedTerms"
                        name="acceptedTerms"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <Label htmlFor="acceptedTerms" className="text-gray-700 text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/policy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              ) : (
                <CardContent className="px-8 pb-6 text-center">
                  <div className="my-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
                    <p className="font-medium">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => setSuccess(false)}
                        className="text-blue-600 hover:underline"
                      >
                        try again
                      </button>
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Go to login page
                  </Link>
                </CardContent>
              )}

              {!success && (
                <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              )}
            </Card>
          </div>
        )
      }
    </>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}