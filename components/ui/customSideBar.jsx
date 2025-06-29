"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, LayoutTemplate, LogOut, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar({ trialDays = 14, isActive = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

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
      {/* Mobile Edge Trigger */}
      <div className="md:hidden fixed left-0 top-1/2 z-20 -translate-y-1/2">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-6 h-16 bg-white border border-l-0 border-gray-200 rounded-r-lg shadow-sm flex items-center justify-center transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-4 w-4 text-gray-500 transition-transform duration-200" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity duration-300 ease-out"
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
          "fixed md:sticky top-0 h-screen bg-white border-r z-40",
          "w-64",
          isCollapsed && "md:w-20",
          "transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
          !isMobileOpen && "-left-full md:left-0",
          isMobileOpen && "left-0 shadow-xl"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div 
            className={cn(
              "flex items-center h-16 px-4 border-b",
              isCollapsed ? "justify-center" : "px-6"
            )}
          >
            <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold ml-2 text-lg">Schedulee.app</span>
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
                    "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname.startsWith(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700",
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
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none whitespace-nowrap">
                      {item.name}
                      <div className="absolute right-full top-1/2 -mt-2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-t-transparent border-b-transparent border-r-gray-900" />
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Subscription Status Area */}
          <div className={cn(
            "p-3 border-t space-y-2",
            isCollapsed ? "flex flex-col items-center" : ""
          )}>
            {!isActive ? (
              !isCollapsed && (
                <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-center transition-all duration-200 hover:bg-blue-100">
                  <span className="animate-pulse mr-2">⏳</span>
                  <span>Trial: {trialDays} days left</span>
                </div>
              )
            ) : (
              !isCollapsed && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Plan
                </Button>
              )
            )}

            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full text-gray-700 hover:bg-gray-100 transition-colors duration-200",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sign out</span>}
            </Button>
          </div>

          {/* Collapse Button - Desktop Only */}
          <div className="p-2 border-t hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-500 hover:text-gray-700 transition-colors duration-200"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform duration-300"
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
              {!isCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}