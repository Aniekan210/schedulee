"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  LayoutTemplate,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function DashboardSidebar({ trialDays = 14, isPaid = false }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: "Bookings",
      icon: Calendar,
      href: "/dashboard/bookings",
      ariaLabel: "View and manage your bookings",
    },
    {
      name: "Availability",
      icon: Clock,
      href: "/dashboard/availability",
      ariaLabel: "Set your available hours",
    },
    {
      name: "Booking Page",
      icon: LayoutTemplate,
      href: "/dashboard/customize",
      ariaLabel: "Customize your booking page",
    },
  ];

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden fixed left-0 top-1/2 z-20 -translate-y-1/2">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-12 h-24 bg-white border border-l-0 border-gray-200 rounded-r-lg shadow-lg flex items-center justify-center transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 group"
          aria-label="Open navigation menu"
        >
          <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-500 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <ChevronRight className="h-6 w-6 text-gray-500 transition-transform duration-200" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ease-out"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Main navigation"
        className={cn(
          "fixed md:sticky top-0 h-screen bg-white border-r border-gray-200 z-40",
          "w-64 transition-transform duration-300 ease-in-out",
          !isMobileOpen && "-left-full md:left-0",
          isMobileOpen && "left-0 shadow-xl"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <header className="flex items-center h-16 px-6 border-b border-gray-200">
            <Image
              width={32}
              height={32}
              src="/logo.avif"
              alt="Schedulee.app logo"
              priority
            />
            <h1 className="font-semibold ml-2 text-lg">Schedulee.app</h1>
          </header>

          {/* Navigation Links */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      pathname.startsWith(item.href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    aria-current={
                      pathname.startsWith(item.href) ? "page" : undefined
                    }
                    aria-label={item.ariaLabel}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Secondary Links */}
            <div className="space-y-1 text-sm text-gray-500">
              {isPaid ? (
                <Link
                  href="/cancel"
                  className="block px-2 py-1 hover:text-gray-700 transition-colors"
                  aria-label="Manage your subscription"
                >
                  Manage Subscription
                </Link>
              ) : (
                <div className="px-2 py-1">
                  <span className="text-xs block">Trial period</span>
                  <span className="text-gray-700">{trialDays} days left</span>
                </div>
              )}

              <Link
                href="/feature-request"
                className="block px-2 py-1 hover:text-gray-700 transition-colors"
                aria-label="Request a new feature"
              >
                Request a Feature
              </Link>
            </div>

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 text-gray-600 hover:bg-gray-100"
              onClick={async () => {
                setIsSigningOut(true);
                try {
                  const res = await fetch("/api/signout", {
                    method: "POST",
                  });

                  if (typeof window !== "undefined") {
                    Object.keys(localStorage).forEach((key) => {
                      if (key.startsWith("sb-")) {
                        localStorage.removeItem(key);
                      }
                    });
                  }

                  await new Promise((r) => setTimeout(r, 100));
                  window.location.href = "/login";
                } catch (err) {
                  console.error("Sign out failed:", err);
                } finally {
                  setIsSigningOut(false);
                }
              }}
              disabled={isSigningOut}
              aria-label={isSigningOut ? "Signing out..." : "Sign out"}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">
                {isSigningOut ? "Signing out..." : "Sign out"}
              </span>
              {isSigningOut && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
