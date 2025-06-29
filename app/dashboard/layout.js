import DashboardSidebar from "@/components/ui/customSideBar";

export default function RootLayout({ children }) {
  return (
    <main className="w-screen h-screen overflow-hidden flex [flex-flow:row_nowrap] m-0 p-0">
      <DashboardSidebar trialDays={0} isActive={false} />
      <div className="w-full h-full overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
