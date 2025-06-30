"use client";

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="relative h-20 w-20">
        {/* Subtle outer ring (static) */}
        <div className="absolute inset-0 border-[3px] border-muted rounded-full"></div>
        {/* Animated spinner */}
        <div className="absolute inset-0 border-[3px] border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
