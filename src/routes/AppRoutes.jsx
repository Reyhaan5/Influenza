import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import InfluencerDashboard from "../pages/InfluencerDashboard";
import InfluencerAccount from "../pages/InfluencerAccount";
import BrandDashboard from "../pages/BrandDashboard";
import PricingCalculator from "../pages/PricingCalculator";
import ProtectedRoute from "./ProtectedRoute";
import BrandCampaigns from "../pages/BrandCampaigns";
import BrandSearch from "../pages/BrandSearch";
import BrandCollaborations from "../pages/BrandCollaborations";
import CollaborationRequests from "../pages/CollaborationRequests";
import BrowseOpportunities from "../pages/BrowseOpportunities";
import Messages from "../pages/Messages";
import BrowseCategories from "../pages/BrowseCategories";
import CategoryResults from "../pages/CategoryResults";
import ContentGallery from "../pages/ContentGallery";
import CreatorDiscovery from "../pages/CreatorDiscovery";
import CreatorProfile from "../pages/CreatorProfile";
import CreatorOnboarding from "../pages/CreatorOnboarding";
import NotFound from "../components/ui/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/pricing-calculator" element={<PricingCalculator />} />

        {/* Public — no login required */}
        <Route path="/categories" element={<BrowseCategories />} />
        <Route path="/categories/:category" element={<CategoryResults />} />
        <Route path="/creator-discovery" element={<CreatorDiscovery />} />
        <Route path="/creators/:id" element={<CreatorProfile />} />
        <Route path="/content-gallery" element={<ContentGallery />} />

        <Route
          path="/creator-onboarding"
          element={
            <ProtectedRoute allowedRole="influencer">
              <CreatorOnboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/influencer-dashboard"
          element={
            <ProtectedRoute allowedRole="influencer">
              <InfluencerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute allowedRole="influencer">
              <InfluencerAccount />
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
        {/* Shared by both roles — chat between brands and influencers */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* Catch-all — 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;