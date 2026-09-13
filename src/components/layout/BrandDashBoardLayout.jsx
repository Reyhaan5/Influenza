import React from "react";
import BrandSidebar from "../dashboard/brand/BrandSidebar";
import DashboardTopBar from "./DashboardTopBar";

export default function BrandDashboardLayout({ children, noPadding = false, hideTopBar = false }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <BrandSidebar />
      <main className={`flex-1 min-w-0 ${noPadding ? "p-0 flex flex-col h-screen overflow-hidden" : "p-6 lg:p-10"}`}>
        {!noPadding && !hideTopBar && <DashboardTopBar role="brand" />}
        {children}
      </main>
    </div>
  );
}