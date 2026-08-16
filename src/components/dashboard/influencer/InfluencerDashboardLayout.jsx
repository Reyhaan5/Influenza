import React from "react";
import InfluencerSidebar from "./InfluencerSidebar";

export default function InfluencerDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <InfluencerSidebar />
      <main className="flex-1 min-w-0 p-8 lg:p-10">{children}</main>
    </div>
  );
}