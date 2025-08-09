"use client";
import { useState } from "react";
import { Sparkles, Check, Mail } from "lucide-react";
import { FaPinterestP } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function FeatureRequestPage() {
  const [formData, setFormData] = useState({
    feature: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.feature.trim()) {
      newErrors.feature = "Feature description is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/feature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feature. Please try again.");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting feature:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="px-4 py-20 mx-auto max-w-[1200px] sm:py-16">
          <div className="px-8 py-12 bg-white rounded-xl shadow-sm sm:px-6 sm:py-8">
            {isSuccess ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-neutral-800 sm:text-2xl">
                  Feature Request Submitted!
                </h2>
                <p className="mx-auto mb-8 text-lg text-zinc-500 max-w-[500px]">
                  Thank you for your suggestion! We'll review it and may reach
                  out if we need more information.
                </p>
                <Button
                  asChild
                  className="min-w-[220px] bg-blue-500 hover:bg-blue-600"
                >
                  <Link href="/dashboard/bookings">Go Back</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center px-3 py-1.5 mb-4 text-xs font-medium bg-blue-100 rounded-full text-blue-600">
                    <Sparkles size={14} className="mr-1" />
                    Help us improve Schedulee.app
                  </div>
                  <h2 className="mb-2 text-3xl font-bold text-neutral-800 sm:text-2xl">
                    Suggest a Feature
                  </h2>
                  <p className="mx-auto mb-6 text-lg text-zinc-500 max-w-[600px]">
                    Have an idea to make Schedulee.app better? We'd love to hear
                    it!
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
                    {submitError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="max-w-md mx-auto space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="feature">Feature Description *</Label>
                    <textarea
                      id="feature"
                      name="feature"
                      rows={6}
                      className="w-full px-4 py-3 text-base border rounded-lg border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the feature you'd like to see. Be as specific as possible..."
                      value={formData.feature}
                      onChange={handleChange}
                    />
                    {errors.feature && (
                      <p className="text-sm text-red-500">{errors.feature}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                    <p className="text-sm text-zinc-500">
                      We'll only use this to contact you about your suggestion.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 animate-spin"
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
                        Submitting...
                      </>
                    ) : (
                      "Submit Feature Request"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-solid border-zinc-200">
      <div className="flex justify-between items-center px-4 py-0 mx-auto h-16 max-w-[1200px]">
        <div className="flex gap-2 items-center">
          <img
            alt="Schedulee.app logo"
            src="/logo.png"
            className="object-cover overflow-hidden w-8 h-8"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold text-neutral-800">
            Schedulee.app
          </span>
        </div>
        <nav
          className="hidden md:flex flex-1 gap-8 justify-center items-center"
          role="navigation"
          aria-label="Main navigation"
        >
          <a
            className="text-sm font-medium no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="/"
          >
            Home
          </a>
          <a
            className="text-sm font-medium no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="/#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="/#contact"
          >
            Contact
          </a>
        </nav>
        <div className="flex gap-3 items-center">
          <a
            href="/dashboard/bookings"
            className="hidden px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md cursor-pointer text-white bg-blue-500 hover:bg-blue-600 active:scale-95 md:block"
          >
            Start Free Trial
          </a>
          <button
            className="block p-2 cursor-pointer md:hidden"
            aria-label="Toggle mobile menu"
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div
        className={`px-4 py-4 bg-white border-t border-solid border-zinc-200 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
        id="mobile-navigation"
      >
        <nav className="flex flex-col gap-4">
          <a
            className="text-base font-medium no-underline text-zinc-500 hover:text-zinc-700"
            href="/"
            onClick={toggleMobileMenu}
          >
            Home
          </a>
          <a
            className="text-base font-medium no-underline text-zinc-500 hover:text-zinc-700"
            href="#features"
            onClick={toggleMobileMenu}
          >
            Features
          </a>
          <a
            className="text-base font-medium no-underline text-zinc-500 hover:text-zinc-700"
            href="#contact"
            onClick={toggleMobileMenu}
          >
            Contact
          </a>
          <a
            href="/dashboard/bookings"
            className="w-full px-4 py-3 mt-2 text-base font-medium text-center transition-all duration-200 rounded-md cursor-pointer text-white bg-blue-500 hover:bg-blue-600 active:scale-95"
          >
            Start Free Trial
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      id="contact"
      className="px-4 pt-12 pb-6 bg-white border-t border-solid border-zinc-200"
    >
      <div className="mx-auto text-center max-w-[1200px]">
        <div className="flex gap-2 justify-center items-center mb-6">
          <img
            alt="Schedulee.app logo"
            src="/logo.png"
            className="object-cover overflow-hidden w-6 h-6"
            width={24}
            height={24}
          />
          <span className="text-lg font-bold text-neutral-800">
            Schedulee.app
          </span>
        </div>
        <nav
          role="navigation"
          aria-label="Footer navigation"
          className="flex flex-wrap gap-6 justify-center mb-6"
        >
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="/terms"
          >
            Terms
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="/privacy"
          >
            Privacy
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="mailto:support@schedulee.app"
          >
            <Mail size={14} />
            Contact
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="https://www.instagram.com/schedulee_app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            Instagram
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="https://www.youtube.com/@schedulee_app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
            Youtube
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="https://www.pinterest.com/schedulee_app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPinterestP size={14} />
            Pinterest
          </a>
        </nav>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Schedulee.app. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
