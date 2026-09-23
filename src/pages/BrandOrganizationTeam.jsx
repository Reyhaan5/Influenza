import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  RefreshCw,
  Mail,
  Shield,
  X,
} from "lucide-react";

import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import { API_URL } from "../config/api";

export default function BrandOrganizationTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    access: "Full Access",
  });
  const [inviting, setInviting] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/brand/team`, authHeader);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Error fetching team:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteForm.email) return;

    setInviting(true);
    try {
      const res = await axios.post(
        `${API_URL}/brand/team/invite`,
        inviteForm,
        authHeader
      );
      setMembers((prev) => [...prev, res.data.member]);
      setShowInviteModal(false);
      setInviteForm({ name: "", email: "", access: "Full Access" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to invite team member.");
    } finally {
      setInviting(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    const confirmed = window.confirm("Remove this team member?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/brand/team/${memberId}`, authHeader);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove member.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "19 August 2026";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <BrandDashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team</h1>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Invite new member</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-6">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>

        {/* Team Table View */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="py-24 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin text-gray-400" />
              <span>Loading team members...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 font-semibold text-[11px]">
                    <th className="py-3.5 px-6 font-semibold">Name</th>
                    <th className="py-3.5 px-6 font-semibold">Joined at</th>
                    <th className="py-3.5 px-6 font-semibold">Access</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m) => {
                    const initials = m.name
                      ? m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "U";

                    return (
                      <tr key={m._id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Name Column with Avatar + Badges */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-xs">{m.name}</span>
                                {m.isOwner && (
                                  <>
                                    <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                      You
                                    </span>
                                    <span className="bg-zinc-100 text-zinc-900 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200">
                                      Organization owner
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">{m.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Joined at Column */}
                        <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                          {formatDate(m.createdAt)}
                        </td>

                        {/* Access Column */}
                        <td className="py-4 px-6 text-gray-700 font-medium">
                          {m.access || "Full Access"}
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-6 text-right">
                          {m.isOwner ? (
                            <span className="text-gray-300 select-none">
                              <Trash2 size={14} className="opacity-30 inline" />
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteMember(m._id)}
                              className="text-gray-400 hover:text-red-600 transition p-1 cursor-pointer"
                              title="Remove member"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">Invite team member</h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    placeholder="colleague@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name (optional)
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Access Level
                  </label>
                  <select
                    value={inviteForm.access}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, access: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 bg-white cursor-pointer"
                  >
                    <option value="Full Access">Full Access (Manage campaigns, brands & team)</option>
                    <option value="Campaign Manager">Campaign Manager (Create and run campaigns)</option>
                    <option value="Reviewer">Reviewer (Review submitted creatives and chat)</option>
                    <option value="Viewer">Viewer (Read-only access)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting || !inviteForm.email}
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {inviting ? "Inviting..." : "Send invite"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BrandDashboardLayout>
  );
}
