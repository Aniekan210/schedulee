"use client";

import DashboardSidebar from "@/components/ui/customSideBar";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  );
}

function AuthContent({ children }) {
  const { hasPaid, daysLeft, isLoading } = useAuth();

  return isLoading ? (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-24 h-24 border-8 border-white border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  ) : (
    <main className="w-screen h-screen overflow-hidden flex [flex-flow:row_nowrap] m-0 p-0">
      <DashboardSidebar isPaid={hasPaid} trialDays={daysLeft} />
      <div className="w-full h-full overflow-x-hidden overflow-y-auto">
        {children}
        <Toaster />
      </div>
    </main>
  );
}
