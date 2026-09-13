import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useAuth } from "./AuthContext";

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const { user } = useAuth();
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrandState] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || user?.role !== "brand") return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/brand/brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const brandList = res.data.brands || [];
      setBrands(brandList);

      const savedBrandId = localStorage.getItem("activeBrandId");
      if (savedBrandId) {
        const found = brandList.find((b) => b._id === savedBrandId);
        if (found) {
          setActiveBrandState(found);
          return;
        }
      }

      if (brandList.length > 0) {
        setActiveBrandState(brandList[0]);
        localStorage.setItem("activeBrandId", brandList[0]._id);
      } else {
        // Fallback default brand representation for single-brand user
        const fallback = {
          _id: "default",
          name: user?.name || "My Brand",
          category: "General",
          isDefault: true,
        };
        setActiveBrandState(fallback);
      }
    } catch (err) {
      console.warn("BrandContext fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "brand") {
      fetchBrands();
    } else {
      setBrands([]);
      setActiveBrandState(null);
    }
  }, [user, fetchBrands]);

  const setActiveBrand = (brand) => {
    setActiveBrandState(brand);
    if (brand?._id && brand._id !== "default") {
      localStorage.setItem("activeBrandId", brand._id);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brands,
        activeBrand,
        setActiveBrand,
        activeBrandId: activeBrand?._id || null,
        loading,
        refreshBrands: fetchBrands,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useActiveBrand() {
  const context = useContext(BrandContext);
  return context || {};
}
