import React from "react";
import InfluencerSidebar from "./InfluencerSidebar";
import DashboardTopBar from "../../layout/DashboardTopBar";

export default function InfluencerDashboardLayout({ children, hideTopBar = false }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <InfluencerSidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-10">
        {!hideTopBar && <DashboardTopBar role="influencer" />}
        {children}
      </main>
    </div>
  );
}