import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

function CategoryRedirect() {
  const { category } = useParams();
  return <Navigate to={`/creator-discovery?category=${encodeURIComponent(category || "")}`} replace />;
}

import Home from "../pages/Home";
import Login from "../pages/Login";
import InfluencerDashboard from "../pages/InfluencerDashboard";
import InfluencerAccount from "../pages/InfluencerAccount";
import BrandDashboard from "../pages/BrandDashboard";
import PricingCalculator from "../pages/PricingCalculator";
import ProtectedRoute from "./ProtectedRoute";
import BrandCampaigns from "../pages/BrandCampaigns";
import BrandChats from "../pages/BrandChats";
import BrandSearch from "../pages/BrandSearch";
import BrandCollaborations from "../pages/BrandCollaborations";
import BrandOrganizationBrands from "../pages/BrandOrganizationBrands";
import BrandOrganizationTeam from "../pages/BrandOrganizationTeam";
import BrandCreatorLists from "../pages/BrandCreatorLists";
import BrandCreativeLibrary from "../pages/BrandCreativeLibrary";
import CollaborationRequests from "../pages/CollaborationRequests";
import PartnershipsHub from "../pages/PartnershipsHub";
import BrowseOpportunities from "../pages/BrowseOpportunities";
import Messages from "../pages/Messages";
import ContentGallery from "../pages/ContentGallery";
import CreatorDiscovery from "../pages/CreatorDiscovery";
import CreatorProfile from "../pages/CreatorProfile";
import CreatorOnboarding from "../pages/CreatorOnboarding";
import InsiderRateCalculator from "../pages/InsiderRateCalculator";
import About from "../pages/About";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import NotFound from "../components/ui/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/pricing-calculator" element={<PricingCalculator />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Public — no login required */}
        <Route path="/categories" element={<Navigate to="/creator-discovery" replace />} />
        <Route path="/categories/:category" element={<CategoryRedirect />} />
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
          path="/rate-benchmark"
          element={
            <ProtectedRoute allowedRole="influencer">
              <InsiderRateCalculator />
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
          path="/brand-dashboard/chats"
          element={
            <ProtectedRoute allowedRole="brand">
              <Navigate to="/messages" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard/search"
          element={
            <ProtectedRoute allowedRole="brand">
              <Navigate to="/creator-discovery" replace />
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
        <Route
          path="/brand-dashboard/organization/brands"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandOrganizationBrands />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard/organization/team"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandOrganizationTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard/lists"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandCreatorLists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-dashboard/creatives"
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandCreativeLibrary />
            </ProtectedRoute>
          }
        />
        {/* Unified Partnerships Hub — Shared by both roles with role-adapted views */}
        <Route
          path="/collaborations"
          element={
            <ProtectedRoute>
              <PartnershipsHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partnerships"
          element={<Navigate to="/collaborations" replace />}
        />
        <Route
          path="/collaboration-requests"
          element={
            <ProtectedRoute>
              <PartnershipsHub />
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