import React, { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone, Users } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import StatCard from "../components/dashboard/influencer/StatCard";
import BrandProfileCard from "../components/dashboard/brand/BrandProfileCard";
import ProfileCompletionBanner from "../components/dashboard/brand/ProfileCompletionBanner";
import CompanyInfoCard from "../components/dashboard/brand/CompanyInfoCard";
import CompanySavedBar from "../components/dashboard/brand/CompanySavedBar";
import ProductInfoCard from "../components/dashboard/brand/ProductInfoCard";

const API_URL = "http://localhost:5000/api";
const API_ORIGIN = "http://localhost:5000";

const loggedInUser = JSON.parse(localStorage.getItem("user"));

const initialCompanyDetails = {
  companyName: "",
  industry: "",
  website: "",
  email: loggedInUser?.email || "",
  location: "",
};

const emptyProductForm = {
  productName: "",
  productCategory: "",
  productDescription: "",
  targetGender: "All",
  targetAgeGroup: "18-24",
  targetAgeCustom: "",
  productPrice: "",
  productImageFile: null,
};

export default function BrandDashboard() {
  const [companyDetails, setCompanyDetails] = useState(initialCompanyDetails);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [removingProduct, setRemovingProduct] = useState(false);
  const [companyFormVisible, setCompanyFormVisible] = useState(true);
  const [stats, setStats] = useState({ activeCampaigns: 0, collaborations: 0 });

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchProducts();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/brand/profile`, authHeader);
      const profile = res.data;

      setCompanyDetails({
        companyName: profile.companyName || "",
        industry: profile.industry || "",
        website: profile.website || "",
        email: profile.email || loggedInUser?.email || "",
        location: profile.location || "",
      });

      if (profile.companyName) {
        setCompanyFormVisible(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/brand/dashboard`, authHeader);
      setStats(res.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/brand/products`, authHeader);
      const fetched = res.data.products || [];
      setProducts(fetched);
      if (fetched.length > 0) {
        setSelectedProductId(fetched[0]._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompanyChange = (field, value) => {
    setCompanyDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductChange = (field, value) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    try {
      await axios.put(
        `${API_URL}/brand/profile/company`,
        {
          companyName: companyDetails.companyName,
          industry: companyDetails.industry,
          website: companyDetails.website,
          location: companyDetails.location,
        },
        authHeader
      );

      setCompanyFormVisible(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save company information.");
    } finally {
      setSavingCompany(false);
    }
  };

  const handleEditProduct = (product) => {
    if (!product) return;

    setEditingProductId(product._id);
    setProductForm({
      productName: product.productName || "",
      productCategory: product.productCategory || "",
      productDescription: product.productDescription || "",
      targetGender: product.targetGender || "All",
      targetAgeGroup: product.targetAgeGroup || "18-24",
      targetAgeCustom: product.targetAgeCustom || "",
      productPrice: product.productPrice || "",
      productImageFile: null,
    });

    // Scroll the form into view so it's obvious editing started —
    // helpful since the form sits lower on the page than the product list.
    document.getElementById("product-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const handleSaveProduct = async () => {
    setSavingProduct(true);
    try {
      const formData = new FormData();
      formData.append("productName", productForm.productName ?? "");
      formData.append("productCategory", productForm.productCategory ?? "");
      formData.append("productDescription", productForm.productDescription ?? "");
      formData.append("targetGender", productForm.targetGender ?? "All");
      formData.append("targetAgeGroup", productForm.targetAgeGroup ?? "18-24");
      formData.append("targetAgeCustom", productForm.targetAgeCustom ?? "");
      formData.append("productPrice", productForm.productPrice ?? "");

      if (productForm.productImageFile instanceof File) {
        formData.append("productImage", productForm.productImageFile);
      }

      if (editingProductId) {
        // Update existing product
        const res = await axios.put(
          `${API_URL}/brand/products/${editingProductId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedProduct = res.data.product;

        setProducts((prev) =>
          prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
        );
        setSelectedProductId(updatedProduct._id);
        setEditingProductId(null);
      } else {
        // Create new product
        const res = await axios.post(`${API_URL}/brand/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const newProduct = res.data.product;

        setProducts((prev) => [newProduct, ...prev]);
        setSelectedProductId(newProduct._id);
      }

      setProductForm(emptyProductForm);
    } catch (error) {
      console.error(error);
      alert(editingProductId ? "Failed to update product." : "Failed to save product information.");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!productId) return;

    const confirmed = window.confirm("Remove this product? This can't be undone.");
    if (!confirmed) return;

    setRemovingProduct(true);
    try {
      await axios.delete(`${API_URL}/brand/products/${productId}`, authHeader);

      setProducts((prev) => {
        const updated = prev.filter((p) => p._id !== productId);
        setSelectedProductId(updated.length > 0 ? updated[0]._id : null);
        return updated;
      });

      // If the product being edited was just deleted, exit edit mode too.
      if (editingProductId === productId) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to remove product.");
    } finally {
      setRemovingProduct(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Section className="pt-32">
          <h2 className="text-xl font-semibold text-center">
            Loading Profile...
          </h2>
        </Section>
      </>
    );
  }

  const selectedProduct =
    products.find((p) => p._id === selectedProductId) || null;
  const selectedProductImage = selectedProduct?.productImage
    ? `${API_ORIGIN}${selectedProduct.productImage}`
    : null;

  return (
    <>
      <Navbar />

      <Section className="pt-32">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-8">
          Brand Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT PANEL */}

          <div className="lg:col-span-1 flex flex-col gap-6">

            <BrandProfileCard
              companyName={companyDetails.companyName || "Your Company"}
              industry={companyDetails.industry || "Industry"}
              campaignsRun={stats.activeCampaigns}
              creatorsPartnered={stats.collaborations}
              verified={false}
              products={products}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
              onEditProduct={handleEditProduct}
              onRemoveProduct={handleRemoveProduct}
              removing={removingProduct}
            />

            <ProfileCompletionBanner pct={70} productImage={selectedProductImage} />

          </div>

          {/* RIGHT PANEL */}

          <div className="lg:col-span-2 flex flex-col gap-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <StatCard
                icon={Megaphone}
                label="Active Campaigns"
                value={stats.activeCampaigns}
              />

              <StatCard
                icon={Users}
                label="Collaborations"
                value={stats.collaborations}
              />

            </div>

            {companyFormVisible ? (
              <CompanyInfoCard
                details={companyDetails}
                onChange={handleCompanyChange}
                onSave={handleSaveCompany}
                saving={savingCompany}
              />
            ) : (
              <CompanySavedBar
                companyName={companyDetails.companyName}
                onEdit={() => setCompanyFormVisible(true)}
              />
            )}

            <div id="product-form-section">
              <ProductInfoCard
                details={productForm}
                onChange={handleProductChange}
                onSave={handleSaveProduct}
                saving={savingProduct}
                isEditing={!!editingProductId}
                onCancelEdit={handleCancelEdit}
              />
            </div>

          </div>

        </div>
      </Section>
    </>
  );
}