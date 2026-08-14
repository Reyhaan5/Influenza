import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import InfluencerDashboard from "../pages/InfluencerDashboard";
import BrandDashboard from "../pages/BrandDashboard";
import PricingCalculator from "../pages/PricingCalculator";
import ProtectedRoute from "./ProtectedRoute";
import BrandCampaigns from "../pages/BrandCampaigns";
import BrandSearch from "../pages/BrandSearch";
import BrandCollaborations from "../pages/BrandCollaborations";
import InsiderRateCalculator from "../pages/InsiderRateCalculator";
import CollaborationRequests from "../pages/CollaborationRequests";
import BrowseOpportunities from "../pages/BrowseOpportunities";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/pricing-calculator" element={<PricingCalculator />} />
        <Route
          path="/influencer-dashboard"
          element={
            <ProtectedRoute allowedRole="influencer">
              <InfluencerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insider-rate"
          element={
            <ProtectedRoute allowedRole="influencer">
              <InsiderRateCalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute allowedRole="influencer">
              <BrowseOpportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard/campaigns"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandCampaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard/search"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard/collaborations"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandCollaborations />
            </ProtectedRoute>
          }
        />
        {/* Shared by both roles — the page itself branches on user.role */}
        <Route
          path="/collaboration-requests"
          element={
            <ProtectedRoute>
              <CollaborationRequests />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
