import React from "react";
import { useAuth } from "../context/AuthContext";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import UnifiedChatApp from "../components/chat/UnifiedChatApp";

export default function Messages() {
  const { user } = useAuth();

  if (user?.role === "brand") {
    return (
      <BrandDashboardLayout noPadding={true}>
        <UnifiedChatApp role="brand" />
      </BrandDashboardLayout>
    );
  }

  return (
    <InfluencerDashboardLayout noPadding={true}>
      <UnifiedChatApp role="influencer" />
    </InfluencerDashboardLayout>
  );
}
