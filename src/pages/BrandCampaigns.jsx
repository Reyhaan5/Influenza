import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

import BrandDashboardLayout from "../components/dashboard/brand/BrandDashboardLayout";
import CampaignCard from "../components/dashboard/brand/CampaignCard";
import CampaignFormModal from "../components/dashboard/brand/CampaignFormModal";

import { API_URL } from "../config/api";

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/brand/campaigns`, authHeader);
      setCampaigns(res.data.campaigns || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCampaign(null);
    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setShowModal(true);
  };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editingCampaign) {
        const res = await axios.put(
          `${API_URL}/brand/campaigns/${editingCampaign._id}`,
          form,
          authHeader
        );
        setCampaigns((prev) =>
          prev.map((c) => (c._id === res.data.campaign._id ? res.data.campaign : c))
        );
      } else {
        const res = await axios.post(`${API_URL}/brand/campaigns`, form, authHeader);
        setCampaigns((prev) => [res.data.campaign, ...prev]);
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this campaign? This can't be undone.");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/brand/campaigns/${id}`, authHeader);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete campaign.");
    }
  };

  const handleToggleStatus = async (campaign) => {
    const newStatus = campaign.status === "open" ? "closed" : "open";
    try {
      const res = await axios.put(
        `${API_URL}/brand/campaigns/${campaign._id}`,
        { status: newStatus },
        authHeader
      );
      setCampaigns((prev) =>
        prev.map((c) => (c._id === res.data.campaign._id ? res.data.campaign : c))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update campaign status.");
    }
  };

  return (
    <BrandDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Campaigns</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold px-5 py-2.5 rounded-xl transition"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--color-text-light)]">Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl">
          <p className="text-[var(--color-text-light)]">
            No campaigns yet. Create your first one to start attracting creators.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((c) => (
            <CampaignCard
              key={c._id}
              campaign={c}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CampaignFormModal
          campaign={editingCampaign}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </BrandDashboardLayout>
  );
}