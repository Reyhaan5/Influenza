import React, { useState, useEffect } from "react";
import { X, Check, Info, ShieldCheck } from "lucide-react";
import api, { API_URL } from "../../../../config/api";
import BrandModal from "./BrandModal";
import ProductModal from "./ProductModal";
import {
  STEPS,
  CAMPAIGN_TYPES_BY_GOAL,
  defaultDeliverable,
} from "./steps/wizardConstants";
import StepCoreDetails from "./steps/StepCoreDetails";
import StepCampaignInfo from "./steps/StepCampaignInfo";
import StepCreators from "./steps/StepCreators";
import StepDeliverables from "./steps/StepDeliverables";
import StepPaymentTerms from "./steps/StepPaymentTerms";

export default function CampaignWizard({ campaign = null, onClose, onCampaignSaved }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Step 1 Form State
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  // Step 2 Form State
  const [campaignGoal, setCampaignGoal] = useState("Awareness & Reach");
  const [platform, setPlatform] = useState("Meta");
  const [campaignType, setCampaignType] = useState("Influencer Posts");
  const [boostWithPartnershipAds, setBoostWithPartnershipAds] = useState(false);
  const [campaignVisibility, setCampaignVisibility] = useState("Visible to matched creators");
  const [productDelivery, setProductDelivery] = useState("I’ll ship the product");

  // Step 3 Form State (Manage Creators)
  const [creatorsCountTier, setCreatorsCountTier] = useState("<5");
  const [targetCreatorsCount, setTargetCreatorsCount] = useState("3");
  const [lookalikesLink, setLookalikesLink] = useState("");
  const [autoInviteSource, setAutoInviteSource] = useState("From Lists");
  const [excludePastCampaigns, setExcludePastCampaigns] = useState(false);
  const [excludeCreatorsType, setExcludeCreatorsType] = useState("All creators");
  const [excludeCampaignQuery, setExcludeCampaignQuery] = useState("");

  // Step 4 Form State (Deliverables)
  const [deliverables, setDeliverables] = useState([defaultDeliverable()]);

  // Step 5 Form State (Payment terms)
  const [minFeePerCreator, setMinFeePerCreator] = useState("");
  const [maxFeePerCreator, setMaxFeePerCreator] = useState("");
  const [salesCommissionsEnabled, setSalesCommissionsEnabled] = useState(true);
  const [commissionRate, setCommissionRate] = useState("10");

  // Modals & UI helpers
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBriefSampleModal, setShowBriefSampleModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingInitial(true);
    try {
      const [brandRes, prodRes] = await Promise.all([
        api.get("/brand/brands").catch(() => ({ data: { brands: [] } })),
        api.get("/brand/products").catch(() => ({ data: { products: [] } })),
      ]);

      const fetchedBrands = brandRes.data?.brands || [];
      const fetchedProducts = prodRes.data?.products || [];

      setBrands(fetchedBrands);
      setProducts(fetchedProducts);

      if (campaign) {
        setCampaignName(campaign.title || "");
        setSelectedBrandId(
          campaign.brandEntity?._id || campaign.brandEntity || fetchedBrands[0]?._id || ""
        );
        setSelectedProductId(
          campaign.product?._id || campaign.product || fetchedProducts[0]?._id || ""
        );
        setCampaignGoal(campaign.campaignGoal || "Awareness & Reach");
        setPlatform(campaign.platform || "Meta");
        setCampaignType(campaign.campaignType || "Influencer Posts");
        setBoostWithPartnershipAds(Boolean(campaign.boostWithPartnershipAds));
        setCampaignVisibility(campaign.campaignVisibility || "Visible to matched creators");
        setProductDelivery(campaign.productDelivery || "I’ll ship the product");

        // Step 3
        setCreatorsCountTier(campaign.creatorsCountTier || "<5");
        setTargetCreatorsCount(
          campaign.targetCreatorsCount ? String(campaign.targetCreatorsCount) : "3"
        );
        setLookalikesLink(campaign.lookalikesLink || "");
        setAutoInviteSource(campaign.autoInviteSource || "From Lists");
        setExcludePastCampaigns(Boolean(campaign.excludePastCampaigns));
        setExcludeCreatorsType(campaign.excludeCreatorsType || "All creators");

        // Step 4
        if (campaign.deliverables && campaign.deliverables.length > 0) {
          setDeliverables(
            campaign.deliverables.map((d) => ({
              ...defaultDeliverable(),
              ...d,
            }))
          );
        }

        // Step 5
        setMinFeePerCreator(campaign.minFeePerCreator ? String(campaign.minFeePerCreator) : "");
        setMaxFeePerCreator(campaign.maxFeePerCreator ? String(campaign.maxFeePerCreator) : "");
        setSalesCommissionsEnabled(
          campaign.salesCommissionsEnabled !== undefined
            ? Boolean(campaign.salesCommissionsEnabled)
            : true
        );
        setCommissionRate(
          campaign.commissionRate !== undefined ? String(campaign.commissionRate) : "10"
        );

        setCurrentStep(campaign.currentStep || 1);
      } else {
        if (fetchedBrands.length > 0) setSelectedBrandId(fetchedBrands[0]._id);
        if (fetchedProducts.length > 0) setSelectedProductId(fetchedProducts[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const isDigitalProduct = selectedProduct?.productType?.toLowerCase().includes("digital");

  const handleGoalChange = (newGoal) => {
    setCampaignGoal(newGoal);
    const availableTypes = CAMPAIGN_TYPES_BY_GOAL[newGoal] || [];
    if (availableTypes.length > 0) {
      setCampaignType(availableTypes[0].id);
    }
  };

  const getTierValidation = () => {
    const num = Number(targetCreatorsCount);
    if (creatorsCountTier === "<5") {
      if (num < 1 || num > 4 || isNaN(num)) return "The field value must be between 1 and 4.";
    } else if (creatorsCountTier === "5-10") {
      if (num < 5 || num > 10 || isNaN(num)) return "The field value must be between 5 and 10.";
    } else if (creatorsCountTier === "10-20") {
      if (num < 10 || num > 20 || isNaN(num)) return "The field value must be between 10 and 20.";
    } else if (creatorsCountTier === ">20") {
      if (num < 21 || isNaN(num)) return "The field value must be 21 or greater.";
    }
    return null;
  };

  const handleDeliverableChange = (index, field, value) => {
    setDeliverables((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddDeliverable = () => {
    setDeliverables((prev) => [...prev, defaultDeliverable()]);
  };

  const handleDuplicateDeliverable = (index) => {
    const itemToClone = deliverables[index];
    setDeliverables((prev) => [
      ...prev.slice(0, index + 1),
      { ...itemToClone, _id: undefined },
      ...prev.slice(index + 1),
    ]);
  };

  const handleDeleteDeliverable = (index) => {
    if (deliverables.length === 1) {
      return alert("You must have at least one deliverable asset.");
    }
    setDeliverables((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleFormatText = (delivIndex, type) => {
    const currentGuide = deliverables[delivIndex]?.creatorGuide || "";
    const formatMap = {
      bold: "**bold text**",
      italic: "*italic text*",
      underline: "<u>underlined text</u>",
      strike: "~~struck text~~",
      bullet: "\n• New bullet point",
      numbered: "\n1. New numbered item",
      link: "[link text](https://)",
    };
    const formatted = formatMap[type] || "";
    if (formatted) {
      handleDeliverableChange(delivIndex, "creatorGuide", currentGuide + "\n" + formatted);
    }
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!selectedBrandId && brands.length === 0) {
        setError("Please add or select a brand.");
        return;
      }
      if (!campaignName.trim()) {
        setError("Please enter a campaign name.");
        return;
      }
      if (!selectedProductId) {
        setError("Please add or select a product.");
        return;
      }
    }
    if (currentStep === 3) {
      const tierErr = getTierValidation();
      if (tierErr) {
        setError(tierErr);
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveCampaign = async (status = "open") => {
    if (!campaignName.trim()) {
      setError("Please provide a campaign name.");
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        title: campaignName.trim(),
        brandEntity: selectedBrandId || undefined,
        product: selectedProductId || undefined,
        campaignGoal,
        platform,
        campaignType,
        boostWithPartnershipAds,
        campaignVisibility,
        productDelivery: isDigitalProduct ? "No delivery needed" : productDelivery,
        creatorsCountTier,
        targetCreatorsCount: Number(targetCreatorsCount) || 3,
        lookalikesLink: lookalikesLink.trim(),
        autoInviteSource,
        excludePastCampaigns,
        excludeCreatorsType,
        excludeCampaignNames: excludeCampaignQuery ? [excludeCampaignQuery] : [],
        deliverables,
        minFeePerCreator: Number(minFeePerCreator) || 0,
        maxFeePerCreator: Number(maxFeePerCreator) || 0,
        salesCommissionsEnabled,
        commissionRate: Number(commissionRate) || 10,
        currentStep,
        status,
        description: selectedProduct?.productDescription || "",
        format: "money",
        rewardValue:
          minFeePerCreator && maxFeePerCreator
            ? `$${minFeePerCreator} - $${maxFeePerCreator}`
            : selectedProduct?.productPrice
            ? `$${selectedProduct.productPrice}`
            : "",
      };

      let res;
      if (campaign?._id) {
        res = await api.put(`/brand/campaigns/${campaign._id}`, payload);
      } else {
        res = await api.post("/brand/campaigns", payload);
      }

      onCampaignSaved(res.data.campaign);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  const tierError = getTierValidation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl relative animate-fadeIn border border-gray-100 my-6 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header & Stepper */}
        <div className="px-7 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-gray-950">
              {campaign ? "Edit Campaign" : "Create Campaign"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200"
                      : isCompleted
                      ? "text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isActive
                        ? "bg-fuchsia-600 text-white"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? <Check size={11} /> : step.id}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-7 overflow-y-auto space-y-6 flex-1 bg-gray-50/40">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 flex items-center gap-2">
              <Info size={16} />
              <span>{error}</span>
            </div>
          )}

          {loadingInitial ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Loading campaign configuration...
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <StepCoreDetails
                  brands={brands}
                  products={products}
                  selectedBrandId={selectedBrandId}
                  setSelectedBrandId={setSelectedBrandId}
                  campaignName={campaignName}
                  setCampaignName={setCampaignName}
                  selectedProductId={selectedProductId}
                  setSelectedProductId={setSelectedProductId}
                  setEditingBrand={setEditingBrand}
                  setShowBrandModal={setShowBrandModal}
                  setEditingProduct={setEditingProduct}
                  setShowProductModal={setShowProductModal}
                />
              )}

              {currentStep === 2 && (
                <StepCampaignInfo
                  campaignGoal={campaignGoal}
                  handleGoalChange={handleGoalChange}
                  platform={platform}
                  setPlatform={setPlatform}
                  campaignType={campaignType}
                  setCampaignType={setCampaignType}
                  boostWithPartnershipAds={boostWithPartnershipAds}
                  setBoostWithPartnershipAds={setBoostWithPartnershipAds}
                  campaignVisibility={campaignVisibility}
                  setCampaignVisibility={setCampaignVisibility}
                  productDelivery={productDelivery}
                  setProductDelivery={setProductDelivery}
                  isDigitalProduct={isDigitalProduct}
                  setShowBriefSampleModal={setShowBriefSampleModal}
                />
              )}

              {currentStep === 3 && (
                <StepCreators
                  creatorsCountTier={creatorsCountTier}
                  setCreatorsCountTier={setCreatorsCountTier}
                  targetCreatorsCount={targetCreatorsCount}
                  setTargetCreatorsCount={setTargetCreatorsCount}
                  lookalikesLink={lookalikesLink}
                  setLookalikesLink={setLookalikesLink}
                  autoInviteSource={autoInviteSource}
                  setAutoInviteSource={setAutoInviteSource}
                  excludePastCampaigns={excludePastCampaigns}
                  setExcludePastCampaigns={setExcludePastCampaigns}
                  excludeCreatorsType={excludeCreatorsType}
                  setExcludeCreatorsType={setExcludeCreatorsType}
                  excludeCampaignQuery={excludeCampaignQuery}
                  setExcludeCampaignQuery={setExcludeCampaignQuery}
                  tierError={tierError}
                />
              )}

              {currentStep === 4 && (
                <StepDeliverables
                  deliverables={deliverables}
                  handleDeliverableChange={handleDeliverableChange}
                  handleAddDeliverable={handleAddDeliverable}
                  handleDeleteDeliverable={handleDeleteDeliverable}
                  handleDuplicateDeliverable={handleDuplicateDeliverable}
                  handleFormatText={handleFormatText}
                />
              )}

              {currentStep === 5 && (
                <StepPaymentTerms
                  minFeePerCreator={minFeePerCreator}
                  setMinFeePerCreator={setMinFeePerCreator}
                  maxFeePerCreator={maxFeePerCreator}
                  setMaxFeePerCreator={setMaxFeePerCreator}
                  salesCommissionsEnabled={salesCommissionsEnabled}
                  setSalesCommissionsEnabled={setSalesCommissionsEnabled}
                  commissionRate={commissionRate}
                  setCommissionRate={setCommissionRate}
                />
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-7 py-4 border-t border-gray-100 bg-white flex items-center justify-between sticky bottom-0 z-20">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep === 5 ? (
              <button
                type="button"
                onClick={() => handleSaveCampaign("open")}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck size={16} />
                {saving ? "Publishing..." : "Publish Campaign"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      <BrandModal
        isOpen={showBrandModal}
        onClose={() => setShowBrandModal(false)}
        onBrandSaved={(b) => {
          setBrands((prev) => [b, ...prev]);
          setSelectedBrandId(b._id);
        }}
        initialBrand={editingBrand}
      />

      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onProductSaved={(p) => {
          setProducts((prev) => [p, ...prev]);
          setSelectedProductId(p._id);
        }}
        initialProduct={editingProduct}
        brands={brands}
        selectedBrandId={selectedBrandId}
      />

      {/* Sample Brief Modal */}
      {showBriefSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn border border-gray-100 max-h-[85vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowBriefSampleModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-extrabold text-gray-950">Sample Campaign Brief</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              This is a standard template for how creators will see and interact with your campaign.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
