import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";

const ROUTE_TITLES = [
  [["organization/brands"], "Organization / Brands"],
  [["organization/team"], "Organization / Team"],
  [["collaboration-requests"], "Requests & Invitations"],
  [["rate-benchmark", "insider-rate"], "Market Rate Benchmark"],
  [["creator-discovery"], "Creator Discovery"],
  [["opportunities"], "Explore Opportunities"],
  [["partnerships", "collaborations"], "Partnerships"],
  [["campaigns"], "Campaigns"],
  [["lists"], "Creator Lists"],
  [["creatives"], "Creative Library"],
  [["messages"], "Messages & Inbox"],
  [["account"], "My Account"],
];

export function DashboardTopBar({ role = "brand" }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = ["/brand-dashboard", "/influencer-dashboard"].includes(pathname);
  const currentTitle = ROUTE_TITLES.find(([keys]) => keys.some((k) => pathname.includes(k)))?.[1];
  const isBrand = role === "brand";

  return (
    <div className="flex items-center justify-between pb-5 mb-6 border-b border-[var(--color-border)] text-xs text-[var(--color-text-light)]">
      <div className="flex items-center gap-3">
        {!isHome && (
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
            to={isBrand ? "/brand-dashboard" : "/influencer-dashboard"}
            className="hover:text-[var(--color-text)] transition flex items-center gap-1"
          >
            <Home size={13} />
            <span>{isBrand ? "Brand Dashboard" : "Creator Dashboard"}</span>
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