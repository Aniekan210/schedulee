"use client";
import { useState } from "react";
import { Zap, Sparkles, Check, Mail, Info } from "lucide-react";
import { FaPinterestP } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    occupation: "",
    allows_emails: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Age validation (if provided)
    if (formData.age && (isNaN(formData.age) || formData.age < 13)) {
      newErrors.age = "Please enter a valid age (13+)";
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
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to submit form. Please try again."
        );
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
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
                  You're on the list!
                </h2>
                <p className="mx-auto mb-8 text-lg text-zinc-500 max-w-[500px]">
                  Thanks for joining our waitlist. We'll be in touch soon with
                  testing opportunities.
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  className="min-w-[220px] bg-blue-500 hover:bg-blue-600"
                >
                  Back to form
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center px-3 py-1.5 mb-4 text-xs font-medium bg-blue-100 rounded-full text-blue-600">
                    <Sparkles size={14} className="mr-1" />
                    Join our beta testing program
                  </div>
                  <h2 className="mb-2 text-3xl font-bold text-neutral-800 sm:text-2xl">
                    🎉 Join the Schedulee.app Tester Waitlist
                  </h2>
                  <p className="mx-auto mb-6 text-lg text-zinc-500 max-w-[600px]">
                    Be one of the first 10 testers to get free lifetime access
                    to Schedulee.app — our simple, powerful booking tool for
                    small businesses.
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 mb-6 grid place-items-center text-sm text-red-700 bg-red-100 rounded-lg">
                    <h1>{submitError}</h1>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className={errors.first_name ? "border-red-500" : ""}
                        />
                        {errors.first_name && (
                          <p className="text-sm text-red-500">
                            {errors.first_name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="age">Age</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-zinc-400" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[250px]">
                              <p>
                                Optional - helps us understand the diversity of
                                our testers and build better products for
                                everyone.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="13"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Optional"
                        className={errors.age ? "border-red-500" : ""}
                      />
                      {errors.age && (
                        <p className="text-sm text-red-500">{errors.age}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-zinc-400" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[250px]">
                              <p>
                                Optional - helps us tailor testing opportunities
                                to different professional needs.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allows_emails"
                        name="allows_emails"
                        checked={formData.allows_emails}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            allows_emails: checked,
                          }))
                        }
                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <Label htmlFor="allows_emails" className="text-sm">
                        I want to receive tips, promotions and other marketing
                        emails
                      </Label>
                    </div>

                    <div className="pt-2 text-sm text-center text-zinc-500">
                      <button
                        type="button"
                        onClick={() => setShowPrivacyInfo(true)}
                        className="text-blue-500 hover:underline focus:outline-none"
                      >
                        Want to know how we use your data?
                      </button>
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
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Join Waitlist
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <AlertDialog open={showPrivacyInfo} onOpenChange={setShowPrivacyInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How we use your data</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              <div className="space-y-4">
                <p>
                  We collect and store your information securely and never sell
                  it to third-party companies.
                </p>
                <p>
                  <strong>What we collect:</strong> The information you provide
                  in this form (name, email, age, occupation) and your IP
                  address for security purposes.
                </p>
                <p>
                  <strong>How we use it:</strong> To communicate with you about
                  testing opportunities, improve our product based on tester
                  demographics, and (if you opt-in) send relevant marketing
                  communications.
                </p>
                <p>
                  <strong>Data retention:</strong> We keep your information
                  until you request deletion or until it's no longer needed for
                  testing purposes.
                </p>
                <p>
                  You can request deletion of your data at any time by emailing{" "}
                  <a
                    href="mailto:support@schedulee.app"
                    className="text-blue-500 hover:underline"
                  >
                    support@schedulee.app
                  </a>
                  .
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
