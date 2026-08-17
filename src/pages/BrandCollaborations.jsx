import React, { useEffect, useState } from "react";
import axios from "axios";

import BrandDashboardLayout from "../components/dashboard/brand/BrandDashboardLayout";
import CollaborationRow from "../components/dashboard/brand/CollaborationRow";

import { API_URL } from "../config/api";

export default function BrandCollaborations() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      const res = await axios.get(`${API_URL}/brand/collaborations`, authHeader);
      setCollaborations(res.data.collaborations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await axios.put(
        `${API_URL}/brand/collaborations/${id}`,
        updates,
        authHeader
      );
      setCollaborations((prev) =>
        prev.map((c) => (c._id === res.data.collaboration._id ? res.data.collaboration : c))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update collaboration.");
    }
  };

  return (
    <BrandDashboardLayout>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Collaborations</h1>

      {loading ? (
        <p className="text-[var(--color-text-light)]">Loading collaborations...</p>
      ) : collaborations.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl">
          <p className="text-[var(--color-text-light)]">No active collaborations yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {collaborations.map((c) => (
            <CollaborationRow key={c._id} collab={c} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </BrandDashboardLayout>
  );
}