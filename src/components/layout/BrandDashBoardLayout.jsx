import React from "react";
import BrandSidebar from "../dashboard/brand/BrandSidebar";

export default function BrandDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <BrandSidebar />
      <main className="flex-1 min-w-0 p-8 lg:p-10">{children}</main>
    </div>
  );
}