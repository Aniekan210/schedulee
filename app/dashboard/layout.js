"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/ui/customSideBar";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [data, setData] = useState({ hasPaid: false, daysLeft: 14 });

  useEffect(() => {
    const authCheck = async () => {
      if (typeof window === "undefined") return;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      try {
        const res = await fetch("/api/authenticate", {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await res.json();

        if (data.error) {
          router.push("/login");
          return;
        }

        if (!data.hasPaid && data.daysLeft === 0) {
          router.push("/upgrade");
          return;
        }

        setData(data);

        router.push("/dashboard/bookings");
      } catch (error) {
        console.error("authCheck failed:", error);
        router.push("/login");
      }
    };

    authCheck();
  }, [router]);

  return (
    <main className="w-screen h-screen overflow-hidden flex [flex-flow:row_nowrap] m-0 p-0">
      <DashboardSidebar isActive={data.hasPaid} trialDays={data.daysLeft} />
      <div className="w-full h-full overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
