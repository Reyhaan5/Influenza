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
          path="/brand-dashboard"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/brand-dashboard/campaigns" element={<BrandCampaigns />} />
        <Route path="/brand-dashboard/search" element={<BrandSearch />} />
        <Route path="/brand-dashboard/collaborations" element={<BrandCollaborations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;