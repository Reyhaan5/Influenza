import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  Info,
  Pencil,
  Plus,
  ExternalLink,
  Trash2,
  RefreshCw,
  Building2,
} from "lucide-react";

import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import BrandModal from "../components/dashboard/brand/campaign-wizard/BrandModal";
import { API_URL } from "../config/api";

export default function BrandOrganizationBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [activeInfoBrand, setActiveInfoBrand] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/brand/brands`, authHeader);
      setBrands(res.data.brands || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (brand) => {
    const newStatus = brand.status === "inactive" ? "active" : "inactive";
    try {
      const res = await axios.put(
        `${API_URL}/brand/brands/${brand._id}`,
        { status: newStatus },
        authHeader
      );
      setBrands((prev) =>
        prev.map((b) => (b._id === brand._id ? res.data.brand : b))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleBrandSaved = (savedBrand) => {
    setBrands((prev) => {
      const exists = prev.some((b) => b._id === savedBrand._id);
      if (exists) {
        return prev.map((b) => (b._id === savedBrand._id ? savedBrand : b));
      }
      return [savedBrand, ...prev];
    });
    setShowBrandModal(false);
    setEditingBrand(null);
  };

  const handleDeleteBrand = async (brandId, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to remove this brand?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/brand/brands/${brandId}`, authHeader);
      setBrands((prev) => prev.filter((b) => b._id !== brandId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete brand.");
    }
  };

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = b.name?.toLowerCase().includes(query);
        const matchesLink = b.websiteOrSocialLink?.toLowerCase().includes(query);
        const matchesCat = b.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesLink && !matchesCat) return false;
      }
      if (statusFilter) {
        const isInactive = b.status === "inactive";
        if (statusFilter === "active" && isInactive) return false;
        if (statusFilter === "inactive" && !isInactive) return false;
      }
      return true;
    });
  }, [brands, searchQuery, statusFilter]);

  return (
    <BrandDashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header matching Screenshot 1 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Brands</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingBrand(null);
                setShowBrandModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Brand</span>
            </button>
            <button
              onClick={() => alert("Redirecting to subscription plans...")}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Change the plan
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by brand name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-gray-800 placeholder-gray-400 transition"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition cursor-pointer"
            >
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Brands Table View */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="py-24 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin text-gray-400" />
              <span>Loading brands...</span>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3 border border-gray-100">
                <Building2 size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">No brands found</h3>
              <p className="text-xs text-gray-500 mb-5">
                Register multiple brands to manage campaigns under separate brand profiles.
              </p>
              <button
                onClick={() => {
                  setEditingBrand(null);
                  setShowBrandModal(true);
                }}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition"
              >
                + Add your first brand
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 font-semibold text-[11px]">
                    <th className="py-3.5 px-6 font-semibold">Brand</th>
                    <th className="py-3.5 px-6 font-semibold text-center">Number of campaigns</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBrands.map((b) => {
                    const isActive = b.status !== "inactive";
                    const brandLogo = b.logo;
                    const website = b.websiteOrSocialLink || "No website specified";
                    const cleanWebsite = website.replace(/^https?:\/\//i, "").replace(/\/$/, "");

                    return (
                      <tr key={b._id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Brand Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            {brandLogo ? (
                              <img
                                src={brandLogo.startsWith("http") ? brandLogo : `${API_URL}${brandLogo}`}
                                alt={b.name}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                                {b.name.substring(0, 3).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-gray-900 text-xs">{b.name}</p>
                              <a
                                href={website.startsWith("http") ? website : `https://${website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-gray-500 hover:text-gray-800 transition truncate block max-w-xs"
                              >
                                {cleanWebsite}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Number of Campaigns */}
                        <td className="py-4 px-6 text-center font-medium text-gray-700">
                          {b.campaignCount || 0}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              isActive ? "text-gray-700" : "text-gray-400"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-gray-300"
                              }`}
                            />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions matching Screenshot 1 */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3.5">
                            {/* Info icon */}
                            <button
                              onClick={() => setActiveInfoBrand(b)}
                              className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer"
                              title="Brand details"
                            >
                              <Info size={15} />
                            </button>

                            {/* Edit Pencil icon */}
                            <button
                              onClick={() => {
                                setEditingBrand(b);
                                setShowBrandModal(true);
                              }}
                              className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer"
                              title="Edit brand"
                            >
                              <Pencil size={14} />
                            </button>

                            {/* Active Toggle Switch */}
                            <button
                              onClick={() => handleToggleStatus(b)}
                              className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isActive ? "bg-zinc-900" : "bg-gray-200"
                              }`}
                              title={isActive ? "Disable brand" : "Enable brand"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  isActive ? "translate-x-4.5" : "translate-x-0"
                                }`}
                              />
                            </button>

                            {/* Delete brand button */}
                            <button
                              onClick={(e) => handleDeleteBrand(b._id, e)}
                              className="text-gray-300 hover:text-red-600 transition p-1 cursor-pointer"
                              title="Delete brand"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Brand Information Dialog */}
        {activeInfoBrand && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                {activeInfoBrand.logo ? (
                  <img
                    src={
                      activeInfoBrand.logo.startsWith("http")
                        ? activeInfoBrand.logo
                        : `${API_URL}${activeInfoBrand.logo}`
                    }
                    alt={activeInfoBrand.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
                    {activeInfoBrand.name.substring(0, 3).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{activeInfoBrand.name}</h3>
                  <p className="text-xs text-gray-500">{activeInfoBrand.category || "General Brand"}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p>
                  <strong className="text-gray-900">Website:</strong>{" "}
                  <a
                    href={
                      activeInfoBrand.websiteOrSocialLink?.startsWith("http")
                        ? activeInfoBrand.websiteOrSocialLink
                        : `https://${activeInfoBrand.websiteOrSocialLink}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-900 font-bold underline"
                  >
                    {activeInfoBrand.websiteOrSocialLink || "N/A"}
                  </a>
                </p>
                <p>
                  <strong className="text-gray-900">Description:</strong>{" "}
                  {activeInfoBrand.description || "No description provided."}
                </p>
                <p>
                  <strong className="text-gray-900">Campaigns:</strong>{" "}
                  {activeInfoBrand.campaignCount || 0} active/draft campaigns
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveInfoBrand(null)}
                  className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Brand Create/Edit Modal */}
        {showBrandModal && (
          <BrandModal
            brand={editingBrand}
            onClose={() => {
              setShowBrandModal(false);
              setEditingBrand(null);
            }}
            onBrandSaved={handleBrandSaved}
          />
        )}
      </div>
    </BrandDashboardLayout>
  );
}
