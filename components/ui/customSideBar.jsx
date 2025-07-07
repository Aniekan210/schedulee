"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, LayoutTemplate, LogOut, ChevronRight, Settings, Loader2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function DashboardSidebar({ trialDays = 14, isPaid = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  // Toggle dark mode class on html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: "Bookings",
      icon: Calendar,
      href: "/dashboard/bookings",
    },
    {
      name: "Availability",
      icon: Clock,
      href: "/dashboard/availability",
    },
    {
      name: "Booking Page",
      icon: LayoutTemplate,
      href: "/dashboard/customize",
    },
  ];

  return (
    <>
      {/* TEMPORARY DARK MODE TOGGLE */}
      <div className="fixed top-3 right-4 md:top-6 md:right-8 z-50">
        <Button
          variant="outline"
          size="icon"
          className="shadow-lg bg-white dark:bg-gray-800"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <Sun className="h-7 w-7 md:h-4 md:w-4" />
          ) : (
            <Moon className="h-7 w-7 md:h-4 md:w-4" />
          )}
        </Button>
      </div>

      {/* Mobile Edge Trigger */}
      <div className="md:hidden fixed left-0 top-1/2 z-20 -translate-y-1/2">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-8 h-20 bg-white dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-lg shadow-lg flex items-center justify-center transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 group"
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ease-out"
          style={{
            opacity: isMobileOpen ? 1 : 0,
            pointerEvents: isMobileOpen ? 'auto' : 'none'
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div
        className={cn(
          "fixed md:sticky top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40",
          "w-64",
          isCollapsed && "md:w-20",
          "transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
          !isMobileOpen && "-left-full md:left-0",
          isMobileOpen && "left-0 shadow-xl dark:shadow-gray-950/50"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div 
            className={cn(
              "flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800",
              isCollapsed ? "justify-center" : "px-6"
            )}
          >
            <Image 
              width={32}
              height={32}
              src="/logo.avif"
              alt="logo"
            />
            {!isCollapsed && (
              <span className="font-semibold ml-2 text-lg dark:text-white">Schedulee.app</span>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname.startsWith(item.href)
                      ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                    isCollapsed ? "justify-center" : "px-4"
                  )}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {!isCollapsed && (
                    <span className="ml-3 transition-all duration-200 group-hover:translate-x-1">
                      {item.name}
                    </span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none whitespace-nowrap">
                      {item.name}
                      <div className="absolute right-full top-1/2 -mt-2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-t-transparent border-b-transparent border-r-gray-900 dark:border-r-gray-700" />
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className={cn(
            "p-3 border-t border-gray-200 dark:border-gray-800 space-y-2",
            isCollapsed ? "flex flex-col items-center" : ""
          )}>
            {/* Subscription Status - Subtle Links */}
            {isPaid ? (
              <Link 
                href="/cancel-plan" 
                className={cn(
                  "px-3 py-2 text-sm rounded-md flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors",
                  isCollapsed ? "justify-center" : ""
                )}
                title="Cancel Plan"
              >
                {!isCollapsed ? (
                  <span>Manage Subscription</span>
                ) : (
                  <span>⚙️</span>
                )}
              </Link>
            ) : (
              <Link 
                href="/upgrade" 
                className={cn(
                  "px-3 py-2 text-sm rounded-md flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors",
                  isCollapsed ? "justify-center" : ""
                )}
                title="Upgrade Plan"
              >
                {!isCollapsed ? (
                  <span>Trial: {trialDays} days left</span>
                ) : (
                  <span className="animate-pulse">⏳</span>
                )}
              </Link>
            )}

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-3 justify-start",
                isCollapsed ? "justify-center" : "px-4"
              )}
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
            >
              {isSigningOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              {!isCollapsed && (
                <span className="ml-3 transition-all duration-200 group-hover:translate-x-1">
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </span>
              )}
            </Button>
          </div>

          {/* Collapse Button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-3 justify-start"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  transform: isCollapsed ? 'rotate(180deg)' : 'none'
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {!isCollapsed && (
                <span className="ml-3 transition-all duration-200 group-hover:translate-x-1">
                  Collapse
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}