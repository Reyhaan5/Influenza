import React from "react";
import InfluencerSidebar from "./InfluencerSidebar";
import DashboardTopBar from "../../layout/DashboardTopBar";

export default function InfluencerDashboardLayout({ children, noPadding = false, hideTopBar = false }) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <InfluencerSidebar />
      <main className={`flex-1 min-w-0 ${noPadding ? "p-0 flex flex-col h-screen overflow-hidden" : "p-6 lg:p-10"}`}>
        {!noPadding && !hideTopBar && <DashboardTopBar role="influencer" />}
        {children}
      </main>
    </div>
  );
}