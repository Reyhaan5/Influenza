import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import InfluencerDashboard from "../pages/InfluencerDashboard";
import BrandDashboard from "../pages/BrandDashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
        <Route path="/brand-dashboard" element={<BrandDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;