"use client";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from "@/components/ui/forgotPasswordForm";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY
    );

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      // Initialize the session on the client side if session data exists
      if (data.session) {
        const { error } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (error) throw error;

        // Check if session is properly set
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Session initialization failed");

        window.location.href = "/dashboard/bookings";
      } else {
        throw new Error("Login successful but no session found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
                  Welcome back
                </CardTitle>
                <CardDescription className="text-gray-500 mt-2">
                  Sign in to manage your bookings
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-6">
                <Button
                  onClick={handleGoogleLogin}
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
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-gray-700">
                        Password
                      </Label>
                      <span
                        onClick={() => { setShowForgotPassword(true); }}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Forgot password?
                      </span>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-lg focus:ring-blue-500 border-gray-300"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : "Sign In"}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                <p className="text-sm text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
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