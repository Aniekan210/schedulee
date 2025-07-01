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
  const { hasPaid, daysLeft } = useAuth();

  return (
    <main className="w-screen h-screen overflow-hidden flex [flex-flow:row_nowrap] m-0 p-0">
      <DashboardSidebar isActive={hasPaid} trialDays={daysLeft} />
      <div className="w-full h-full overflow-x-hidden overflow-y-auto">
        {children}
        <Toaster />
      </div>
    </main>
  );
}
