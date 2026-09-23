import React from "react";
import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import UnifiedChatApp from "../components/chat/UnifiedChatApp";

export default function BrandChats() {
  return (
    <BrandDashboardLayout noPadding={true}>
      <UnifiedChatApp role="brand" />
    </BrandDashboardLayout>
  );
}