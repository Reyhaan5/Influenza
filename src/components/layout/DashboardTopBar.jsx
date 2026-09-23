import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";

export function DashboardTopBar({ role = "brand" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeDashboard =
    location.pathname === "/brand-dashboard" ||
    location.pathname === "/influencer-dashboard";

  const getBreadcrumbTitle = (path) => {
    if (path.includes("campaigns")) return "Campaigns";
    if (path.includes("organization/brands")) return "Organization / Brands";
    if (path.includes("organization/team")) return "Organization / Team";
    if (path.includes("lists")) return "Creator Lists";
    if (path.includes("creatives")) return "Creative Library";
    if (path.includes("partnerships") || path.includes("collaborations")) return "Partnerships";
    if (path.includes("collaboration-requests")) return "Requests & Invitations";
    if (path.includes("messages")) return "Messages & Inbox";
    if (path.includes("rate-benchmark") || path.includes("insider-rate")) return "Market Rate Benchmark";
    if (path.includes("account")) return "My Account";
    if (path.includes("opportunities")) return "Explore Opportunities";
    if (path.includes("creator-discovery")) return "Creator Discovery";
    return null;
  };

  const currentTitle = getBreadcrumbTitle(location.pathname);
  const homeUrl = role === "brand" ? "/brand-dashboard" : "/influencer-dashboard";

  return (
    <div className="flex items-center justify-between pb-5 mb-6 border-b border-[var(--color-border)] text-xs text-[var(--color-text-light)]">
      <div className="flex items-center gap-3">
        {!isHomeDashboard && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-background)] font-bold text-[var(--color-text)] transition shadow-xs cursor-pointer"
            title="Go back to previous page"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 font-semibold">
          <Link
            to={homeUrl}
            className="hover:text-[var(--color-text)] transition flex items-center gap-1"
          >
            <Home size={13} />
            <span>{role === "brand" ? "Brand Dashboard" : "Creator Dashboard"}</span>
          </Link>
          {currentTitle && (
            <>
              <ChevronRight size={13} className="text-gray-400" />
              <span className="font-bold text-[var(--color-text)]">{currentTitle}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardTopBar;
