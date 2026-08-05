import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import InfluencerDashboard from "../pages/InfluencerDashboard";
import BrandDashboard from "../pages/BrandDashboard";
<<<<<<< HEAD
import PricingCalculator from "../pages/PricingCalculator";
import ProtectedRoute from "./ProtectedRoute";
=======
import BrandCampaigns from "../pages/BrandCampaigns";
import BrandSearch from "../pages/BrandSearch";
import BrandCollaborations from "../pages/BrandCollaborations";
>>>>>>> 131833e (Added Campaign,Search Creator and colaboration Pages in Brand DashBoard)

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
        <Route path="/brand-dashboard" element={<BrandDashboard />} />
<<<<<<< HEAD
        <Route path="/pricing-calculator" element={<PricingCalculator />} />
        <Route path="/influencer-dashboard" element={<ProtectedRoute allowedRole="influencer"><InfluencerDashboard /></ProtectedRoute>} />
        <Route path="/brand-dashboard" element={<ProtectedRoute allowedRole="brand"><BrandDashboard /></ProtectedRoute>} />
=======
        <Route path="/brand-dashboard/campaigns" element={<BrandCampaigns />} />
        <Route path="/brand-dashboard/search" element={<BrandSearch />} />
        <Route path="/brand-dashboard/collaborations" element={<BrandCollaborations />} />
>>>>>>> 131833e (Added Campaign,Search Creator and colaboration Pages in Brand DashBoard)
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;