import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  RefreshCw,
  Pencil,
  Globe,
  Check,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Users,
  Video,
  CreditCard,
  Layers,
  Info,
  PackageCheck,
  ShieldCheck,
  Gift,
  Share2,
  TrendingUp,
  ShoppingBag,
  Bookmark,
  Trash2,
  Copy,
  Lightbulb,
  Film,
  Camera,
  MessageSquare,
  Tag,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
  UploadCloud,
  Smartphone,
  Square,
  Tv,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../../config/api";
import BrandModal from "./BrandModal";
import ProductModal from "./ProductModal";

const STEPS = [
  { id: 1, title: "Core Details", icon: Layers },
  { id: 2, title: "Campaign info", icon: Sparkles },
  { id: 3, title: "Creators", icon: Users },
  { id: 4, title: "Deliverables", icon: Video },
  { id: 5, title: "Payment Terms", icon: CreditCard },
];

const CAMPAIGN_GOALS = [
  { id: "Multi-Channel UGC", title: "Multi-Channel\nUGC" },
  { id: "Awareness & Reach", title: "Awareness\n& Reach" },
  { id: "Conversions & Sales", title: "Conversions\n& Sales" },
];

const CAMPAIGN_TYPES_BY_GOAL = {
  "Multi-Channel UGC": [
    {
      id: "User-Generated Content",
      title: "User-Generated Content",
      subtitle:
        "Find creators to produce authentic, fully-licensed UGC, both edited and raw footage, for your marketing channels",
      type: "ugc",
    },
  ],
  "Awareness & Reach": [
    {
      id: "Influencer Posts",
      title: "Influencer Posts",
      subtitle:
        "Collaborate with influencers who resonate with your brand to post content to their audiences",
      type: "influencer",
    },
    {
      id: "Product Seeding",
      title: "Product Seeding",
      subtitle:
        "Send free products to influencers in exchange for genuine reviews and to build new partnerships",
      type: "seeding",
    },
    {
      id: "TikTok Spark Ads",
      title: "TikTok Spark Ads",
      subtitle:
        "Partner with influencers to create engaging posts and turn top-performing content into Spark Ads",
      type: "spark_ads",
    },
    {
      id: "Meta Partnership Ads",
      title: "Meta Partnership Ads",
      subtitle:
        "Use influencers’ handles on Meta to produce authentic in-feed ads, leveraging social proof (formerly known as Whitelisting)",
      type: "meta_ads",
    },
  ],
  "Conversions & Sales": [
    {
      id: "TikTok Shop",
      title: "TikTok Shop",
      subtitle:
        "Work with UGC creators and TikTok influencers to produce UGC for Shop and Spark Ads and drive Shop reviews",
      type: "shop",
      hasAuthButton: true,
    },
    {
      id: "TikTok Spark Ads",
      title: "TikTok Spark Ads",
      subtitle:
        "Partner with influencers to create engaging posts and turn top-performing content into Spark Ads",
      type: "spark_ads",
    },
    {
      id: "Meta Partnership Ads",
      title: "Meta Partnership Ads",
      subtitle:
        "Use influencers’ handles on Meta to produce authentic in-feed ads, leveraging social proof (formerly known as Whitelisting)",
      type: "meta_ads",
    },
  ],
};

const VISIBILITY_OPTIONS = [
  {
    id: "Visible to matched creators",
    title: "Visible to matched creators",
    subtitle: "Matching creators can apply",
  },
  {
    id: "Invite only",
    title: "Invite only",
    subtitle: "You’ll invite creators yourself",
  },
];

const SHIPMENT_OPTIONS = [
  {
    id: "No delivery needed",
    title: "No delivery needed",
    subtitle: "Product not needed",
  },
  {
    id: "I’ll reimburse",
    title: "I’ll reimburse",
    subtitle: "Pay creator to buy it",
  },
  {
    id: "I’ll ship the product",
    title: "I’ll ship the product",
    subtitle: "You’ll send it to the creator",
  },
];

const FORMAT_OPTIONS = [
  { id: "9:16 Vertical", label: "9:16\nVertical", icon: Smartphone },
  { id: "4:5 Vertical", label: "4:5\nVertical", icon: Smartphone },
  { id: "1:1 Square", label: "1:1\nSquare", icon: Square },
  { id: "16:9 Horizontal", label: "16:9\nHorizontal", icon: Tv },
];

const PRIMARY_CONTENT_TYPES = [
  "Testimonial",
  "Unboxing",
  "Product Demo",
  "Product Review",
  "How-to",
  "Couple content",
];

const EXTRA_CONTENT_TYPES = [
  "Recipe",
  "ASMR",
  "Podcast",
  "Street interview",
  "Man on the street",
  "Custom",
];

const DEFAULT_GUIDE_TEMPLATE = `Main content messaging:

Main product features:
Feature 1
Feature 2
Feature 3

Required actions:
Talk directly into the camera, while holding [Product name] with packaging in view, discussing your experience with our product, and show the results. The video content needs to appear authentic & unscripted

Creator must be sure to: (to avoid refilming)
Do #1
Do #2
Do #3

Content examples:
Link #1
Link #2
Link #3`;

const CREATOR_TIERS = ["<5", "5-10", "10-20", ">20"];

const defaultDeliverable = () => ({
  mediaType: "Video",
  postingType: "Posting",
  brandTag: "",
  hashtags: "",
  placement: "Reels",
  format: "4:5 Vertical",
  videoMinLength: 15,
  videoMaxLength: 60,
  rawOrReady: "Ready to use Ad",
  contentType: "Testimonial",
  creatorGuide: DEFAULT_GUIDE_TEMPLATE,
  requestHooksAndBRolls: false,
  musicRequirement: "No music",
  whatShouldAvoid: "",
  numberOfPhotos: 1,
  showExtraContentTypes: false,
});

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
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showBriefSampleModal, setShowBriefSampleModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingInitial(true);
    try {
      const [brandRes, prodRes] = await Promise.all([
        axios.get(`${API_URL}/brand/brands`, authHeader).catch(() => ({ data: { brands: [] } })),
        axios.get(`${API_URL}/brand/products`, authHeader).catch(() => ({ data: { products: [] } })),
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

  const selectedBrand = brands.find((b) => b._id === selectedBrandId) || brands[0];
  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const isDigitalProduct = selectedProduct?.productType?.toLowerCase().includes("digital");

  const handleGoalChange = (newGoal) => {
    setCampaignGoal(newGoal);
    const availableTypes = CAMPAIGN_TYPES_BY_GOAL[newGoal] || [];
    if (availableTypes.length > 0) {
      setCampaignType(availableTypes[0].id);
    }
  };

  // Step 3 creators count validation
  const getTierValidation = () => {
    const num = Number(targetCreatorsCount);
    if (creatorsCountTier === "<5") {
      if (num < 1 || num > 4 || isNaN(num)) {
        return "The field value must be between 1 and 4.";
      }
    } else if (creatorsCountTier === "5-10") {
      if (num < 5 || num > 10 || isNaN(num)) {
        return "The field value must be between 5 and 10.";
      }
    } else if (creatorsCountTier === "10-20") {
      if (num < 10 || num > 20 || isNaN(num)) {
        return "The field value must be between 10 and 20.";
      }
    } else if (creatorsCountTier === ">20") {
      if (num < 21 || isNaN(num)) {
        return "The field value must be 21 or greater.";
      }
    }
    return null;
  };

  // Step 4 Deliverables helpers
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
    let formatted = "";
    if (type === "bold") formatted = `**bold text**`;
    if (type === "italic") formatted = `*italic text*`;
    if (type === "underline") formatted = `<u>underlined text</u>`;
    if (type === "strike") formatted = `~~struck text~~`;
    if (type === "bullet") formatted = `\n• New bullet point`;
    if (type === "numbered") formatted = `\n1. New numbered item`;
    if (type === "link") formatted = `[link text](https://)`;

    handleDeliverableChange(delivIndex, "creatorGuide", currentGuide + "\n" + formatted);
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

        // Step 3
        creatorsCountTier,
        targetCreatorsCount: Number(targetCreatorsCount) || 3,
        lookalikesLink: lookalikesLink.trim(),
        autoInviteSource,
        excludePastCampaigns,
        excludeCreatorsType,
        excludeCampaignNames: excludeCampaignQuery ? [excludeCampaignQuery] : [],

        // Step 4
        deliverables,

        // Step 5
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
        res = await axios.put(`${API_URL}/brand/campaigns/${campaign._id}`, payload, authHeader);
      } else {
        res = await axios.post(`${API_URL}/brand/campaigns`, payload, authHeader);
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

  const activeCampaignTypes = CAMPAIGN_TYPES_BY_GOAL[campaignGoal] || [];
  const tierError = getTierValidation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl relative animate-fadeIn border border-gray-100 my-6 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Header & Step Bar */}
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

          {/* Stepper Tabs */}
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

        {/* Scrollable Content Body */}
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
              {/* ======================================================== */}
              {/* STEP 1: CORE DETAILS */}
              {/* ======================================================== */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Card 1: Core Details */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                    <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
                      Core Details
                    </h3>

                    {/* Brand Select */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1">
                        Brand
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Select or add a new brand for this campaign.
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <select
                            value={selectedBrandId}
                            onChange={(e) => {
                              if (e.target.value === "__add_new__") {
                                setEditingBrand(null);
                                setShowBrandModal(true);
                              } else {
                                setSelectedBrandId(e.target.value);
                              }
                            }}
                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition cursor-pointer appearance-none pr-10"
                          >
                            {brands.length === 0 && (
                              <option value="">No brands created yet</option>
                            )}
                            {brands.map((b) => (
                              <option key={b._id} value={b._id}>
                                {b.name}
                              </option>
                            ))}
                            <option value="__add_new__">+ Add a new brand...</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
                            <ChevronRight size={16} className="rotate-90" />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingBrand(null);
                            setShowBrandModal(true);
                          }}
                          className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:border-fuchsia-400 text-fuchsia-700 bg-fuchsia-50/50 hover:bg-fuchsia-50 text-xs font-bold flex items-center gap-1.5 transition flex-shrink-0"
                        >
                          <Plus size={15} /> Add Brand
                        </button>

                        {selectedBrand && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBrand(selectedBrand);
                              setShowBrandModal(true);
                            }}
                            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition"
                            title="Edit Brand"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Campaign Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1">
                        Campaign name
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Pick a title creators will see first — it helps them decide to open your brief
                      </p>
                      <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="e.g. glow"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
                      />
                    </div>
                  </div>

                  {/* Card 2: Product */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
                      Product
                    </h3>

                    {selectedProduct ? (
                      <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 relative space-y-3">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gray-900 flex-shrink-0 overflow-hidden border border-gray-200">
                            {selectedProduct.productImages?.[0] || selectedProduct.productImage ? (
                              <img
                                src={
                                  (selectedProduct.productImages?.[0] || selectedProduct.productImage).startsWith("http")
                                    ? (selectedProduct.productImages?.[0] || selectedProduct.productImage)
                                    : `${API_URL.replace("/api", "")}${selectedProduct.productImages?.[0] || selectedProduct.productImage}`
                                }
                                alt={selectedProduct.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                IMG
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pr-8">
                            <h4 className="font-bold text-sm text-gray-950 truncate">
                              {selectedProduct.productName}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {selectedProduct.brand?.name || selectedBrand?.name || "Brand"} ·{" "}
                              {selectedProduct.productType || "Physical Product"} · $
                              {selectedProduct.productPrice || 0} retail price
                            </p>
                            {selectedProduct.productDescription && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {selectedProduct.productDescription}
                              </p>
                            )}
                            {selectedProduct.productLink && (
                              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1.5 truncate">
                                <Globe size={12} className="flex-shrink-0" />
                                <a
                                  href={selectedProduct.productLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline truncate hover:text-fuchsia-600"
                                >
                                  {selectedProduct.productLink}
                                </a>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(selectedProduct);
                              setShowProductModal(true);
                            }}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                            title="Edit product"
                          >
                            <Pencil size={15} />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-gray-200/60">
                          <button
                            type="button"
                            onClick={() => setShowProductSelector(!showProductSelector)}
                            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-bold text-gray-800 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                          >
                            <RefreshCw size={14} /> Change product
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-300 rounded-2xl space-y-3 bg-gray-50/50">
                        <p className="text-xs text-gray-500">No product selected yet for this campaign.</p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(null);
                              setShowProductModal(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add New Product
                          </button>
                          {products.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowProductSelector(true)}
                              className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
                            >
                              Choose Existing
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {showProductSelector && (
                      <div className="p-4 rounded-2xl bg-gray-100/80 border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700">Select a Product</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(null);
                              setShowProductModal(true);
                            }}
                            className="text-xs font-bold text-fuchsia-600 hover:underline flex items-center gap-1"
                          >
                            <Plus size={13} /> Add new
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {products.map((prod) => (
                            <div
                              key={prod._id}
                              onClick={() => {
                                setSelectedProductId(prod._id);
                                setShowProductSelector(false);
                              }}
                              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                                selectedProductId === prod._id
                                  ? "bg-white border-fuchsia-600 ring-1 ring-fuchsia-600"
                                  : "bg-white border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                {prod.productImages?.[0] || prod.productImage ? (
                                  <img
                                    src={
                                      (prod.productImages?.[0] || prod.productImage).startsWith("http")
                                        ? (prod.productImages?.[0] || prod.productImage)
                                        : `${API_URL.replace("/api", "")}${prod.productImages?.[0] || prod.productImage}`
                                    }
                                    alt={prod.productName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                    IMG
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-gray-900 truncate">
                                  {prod.productName}
                                </p>
                                <p className="text-[10px] text-gray-500 truncate">
                                  ${prod.productPrice || 0} · {prod.productType || "Physical"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 2: CAMPAIGN INFO */}
              {/* ======================================================== */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
                      Campaign info
                    </h3>

                    {/* 1. Campaign Goal */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-2.5">
                        Campaign Goal
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {CAMPAIGN_GOALS.map((goal) => {
                          const isSelected = campaignGoal === goal.id;
                          return (
                            <div
                              key={goal.id}
                              onClick={() => handleGoalChange(goal.id)}
                              className={`p-4 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center min-h-[75px] ${
                                isSelected
                                  ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                                  : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
                              }`}
                            >
                              <span className="text-xs font-bold leading-tight whitespace-pre-line">
                                {goal.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Platform */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-2.5">
                        Platform
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div
                          onClick={() => setPlatform("Meta")}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-center gap-2 ${
                            platform === "Meta"
                              ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 4.5C7.3 4.5 3.5 8.3 3.5 13c0 2.6 1.2 5 3.1 6.6l.4.3.4-.3c1.7-1.4 2.8-3.5 2.8-5.8 0-1.8.8-3.4 2-4.5 1.2 1.1 2 2.7 2 4.5 0 2.3 1.1 4.4 2.8 5.8l.4.3.4-.3c1.9-1.6 3.1-4 3.1-6.6 0-4.7-3.8-8.5-8.9-8.5zm0 1.8c3.9 0 7.1 3.2 7.1 7.1 0 2-.9 3.8-2.3 5-1.4-1.3-2.3-3.1-2.3-5.1 0-2.3-1.1-4.4-2.8-5.8l-.4-.3-.4.3C9.2 8.8 8.1 10.9 8.1 13.2c0 2-.9 3.8-2.3 5.1-1.4-1.2-2.3-3-2.3-5 0-3.9 3.2-7.1 7.1-7.1z" />
                            </svg>
                            <span className="text-[10px] text-fuchsia-600 font-bold">📷</span>
                            <span className="text-[10px] text-blue-600 font-bold">f</span>
                          </div>
                          <span className="text-xs font-bold">Meta</span>
                        </div>

                        <div
                          onClick={() => setPlatform("TikTok")}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-center gap-2 ${
                            platform === "TikTok"
                              ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
                          }`}
                        >
                          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.05.86.15V9.41a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 8.78 5.86 6.33 6.33 0 0 0 3.9-5.86V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
                          </svg>
                          <span className="text-xs font-bold">TikTok</span>
                        </div>

                        <div
                          onClick={() => setPlatform("YouTube (Shorts)")}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-center gap-2 ${
                            platform === "YouTube (Shorts)"
                              ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
                          }`}
                        >
                          <div className="w-5 h-3.5 bg-red-600 rounded flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
                          </div>
                          <span className="text-xs font-bold">YouTube (Shorts)</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Campaign Type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-2.5">
                        Campaign Type
                      </label>
                      <div
                        className={`grid gap-3 ${
                          activeCampaignTypes.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                        }`}
                      >
                        {activeCampaignTypes.map((t) => {
                          const isSelected = campaignType === t.id;
                          return (
                            <div
                              key={t.id}
                              onClick={() => setCampaignType(t.id)}
                              className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-2.5 ${
                                isSelected
                                  ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  {t.type === "ugc" && (
                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                      <Sparkles size={14} />
                                    </div>
                                  )}
                                  {t.type === "influencer" && (
                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                      <Users size={14} />
                                    </div>
                                  )}
                                  {t.type === "seeding" && (
                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                      <Gift size={14} />
                                    </div>
                                  )}
                                  {t.type === "spark_ads" && (
                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                      <Share2 size={14} />
                                    </div>
                                  )}
                                  {t.type === "meta_ads" && (
                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                      <TrendingUp size={14} />
                                    </div>
                                  )}
                                  {t.type === "shop" && (
                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                      <ShoppingBag size={14} />
                                    </div>
                                  )}

                                  <h4 className="font-bold text-xs text-gray-950">{t.title}</h4>
                                </div>

                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                  {t.subtitle}
                                </p>
                              </div>

                              {t.hasAuthButton && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert("TikTok Shop authorization dialog will open.");
                                  }}
                                  className="self-start mt-1 px-3 py-1.5 rounded-lg bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition"
                                >
                                  <RefreshCw size={11} /> Click here to authorize TikTok Shop
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setShowBriefSampleModal(true)}
                          className="text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 flex items-center gap-1 transition"
                        >
                          Check Brief Sample <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* 4. Boost reach with Meta Partnership Ads Banner */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-center gap-4">
                      <div className="w-16 h-20 rounded-xl bg-slate-900 flex-shrink-0 overflow-hidden relative shadow-inner border border-gray-200 flex flex-col justify-end p-1.5">
                        <div className="w-full bg-indigo-600 text-white text-[7px] font-bold px-1 py-0.5 rounded text-center mb-1">
                          Sponsored
                        </div>
                        <div className="w-full h-1 bg-white/40 rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs text-gray-950">
                          Boost reach with Meta Partnership Ads
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          Want to extend your creator collaborations with Meta ads after this deal? Turn
                          this on so we can match you with eligible creators and keep your mix diverse.
                          Brands using partnership ads see 53% higher CTRs and 19% lower CPAs.
                        </p>
                      </div>

                      <div
                        onClick={() => setBoostWithPartnershipAds(!boostWithPartnershipAds)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
                          boostWithPartnershipAds ? "bg-fuchsia-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                            boostWithPartnershipAds ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>

                    {/* 5. Campaign Visibility */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-2.5">
                        Campaign Visibility
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {VISIBILITY_OPTIONS.map((vis) => {
                          const isSelected = campaignVisibility === vis.id;
                          return (
                            <div
                              key={vis.id}
                              onClick={() => setCampaignVisibility(vis.id)}
                              className={`p-4 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center min-h-[75px] ${
                                isSelected
                                  ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <span className="text-xs font-bold text-gray-900 mb-0.5">
                                {vis.title}
                              </span>
                              <span className="text-[11px] text-gray-500">{vis.subtitle}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Shipment */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
                      Shipment
                    </h3>

                    {isDigitalProduct ? (
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                          <PackageCheck size={24} />
                        </div>
                        <h4 className="font-extrabold text-sm text-blue-950">
                          No Shipment Needed for Digital Product
                        </h4>
                        <p className="text-xs text-blue-700 max-w-md mx-auto leading-relaxed">
                          Your selected product is a digital asset (software, digital course, membership, etc.). Creators will receive instant access or download instructions digitally.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          Product Delivery
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                          Choose how you want creators to receive the product
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {SHIPMENT_OPTIONS.map((opt) => {
                            const isSelected =
                              productDelivery === opt.id ||
                              productDelivery.startsWith(opt.title);
                            return (
                              <div
                                key={opt.id}
                                onClick={() => setProductDelivery(opt.id)}
                                className={`p-4 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center min-h-[85px] ${
                                  isSelected
                                    ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                <span className="text-xs font-bold text-gray-900 mb-1">
                                  {opt.title}
                                </span>
                                <span className="text-[11px] text-gray-500">{opt.subtitle}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 3: MANAGE CREATORS */}
              {/* ======================================================== */}
              {currentStep === 3 && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
                    Manage Creators
                  </h3>

                  {/* 1. How many creators do you want to hire? */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2.5">
                      How many creators do you want to hire?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {CREATOR_TIERS.map((tier) => {
                        const isSelected = creatorsCountTier === tier;
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => {
                              setCreatorsCountTier(tier);
                              if (tier === "<5") setTargetCreatorsCount("3");
                              if (tier === "5-10") setTargetCreatorsCount("7");
                              if (tier === "10-20") setTargetCreatorsCount("15");
                              if (tier === ">20") setTargetCreatorsCount("25");
                            }}
                            className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition text-center ${
                              isSelected
                                ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="number"
                      value={targetCreatorsCount}
                      onChange={(e) => setTargetCreatorsCount(e.target.value)}
                      placeholder="Enter your target number of creators"
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none transition ${
                        tierError
                          ? "border-red-400 focus:ring-2 focus:ring-red-400"
                          : "border-gray-200 focus:ring-2 focus:ring-fuchsia-500"
                      }`}
                    />
                    {tierError && (
                      <p className="text-[11px] text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <span>ⓧ</span> {tierError}
                      </p>
                    )}
                  </div>

                  {/* 2. Lookalikes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">
                      Lookalikes
                    </label>
                    <input
                      type="text"
                      value={lookalikesLink}
                      onChange={(e) => setLookalikesLink(e.target.value)}
                      placeholder="Add link to favorites creator"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
                    />
                  </div>

                  {/* 3. Auto-invite creators */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                        <Bookmark size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-950">
                          Auto-invite creators to this campaign
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          These creators will be invited after the brief is launched
                        </p>
                      </div>
                    </div>

                    <div className="relative min-w-[140px]">
                      <select
                        value={autoInviteSource}
                        onChange={(e) => setAutoInviteSource(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none pr-8"
                      >
                        <option value="From Lists">From Lists</option>
                        <option value="Saved Creators">Saved Creators</option>
                        <option value="Top Recommended">Top Recommended</option>
                        <option value="None">None</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  {/* 4. Exclude past campaigns */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-950">
                          Exclude creators from past campaign(s)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Avoid sending this brief to creators in all or specific campaigns
                        </p>
                      </div>

                      <div
                        onClick={() => setExcludePastCampaigns(!excludePastCampaigns)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
                          excludePastCampaigns ? "bg-fuchsia-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                            excludePastCampaigns ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>

                    {excludePastCampaigns && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Creators
                          </label>
                          <div className="relative">
                            <select
                              value={excludeCreatorsType}
                              onChange={(e) => setExcludeCreatorsType(e.target.value)}
                              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none pr-8"
                            >
                              <option value="All creators">All creators</option>
                              <option value="Hired creators">Hired creators</option>
                              <option value="Declined creators">Declined creators</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Campaigns
                          </label>
                          <input
                            type="text"
                            value={excludeCampaignQuery}
                            onChange={(e) => setExcludeCampaignQuery(e.target.value)}
                            placeholder="Add campaign"
                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 4: DELIVERABLES */}
              {/* ======================================================== */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-950">Deliverables</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Add a separate asset for every creative that you want creators to deliver.
                    </p>
                  </div>

                  {/* List of Deliverable Cards */}
                  {deliverables.map((deliv, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm space-y-6 relative"
                    >
                      {/* 1. Media type */}
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          Media type
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          Select the type of creative asset you want for this campaign.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleDeliverableChange(idx, "mediaType", "Video")}
                            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                              deliv.mediaType === "Video"
                                ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <Film size={15} /> Video
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeliverableChange(idx, "mediaType", "Photo")}
                            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                              deliv.mediaType === "Photo"
                                ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <Camera size={15} /> Photo
                          </button>
                        </div>
                      </div>

                      {/* 2. Posting to social media */}
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          Posting to social media
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          Specify if the content requested should be posted by Creators on their channels.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleDeliverableChange(idx, "postingType", "Posting")}
                            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              deliv.postingType === "Posting"
                                ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            Posting <Info size={13} className="text-gray-400" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeliverableChange(idx, "postingType", "No posting")}
                            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              deliv.postingType === "No posting"
                                ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            No posting <Info size={13} className="text-gray-400" />
                          </button>
                        </div>

                        {/* Green Tip Banner */}
                        <div className="mt-2.5 p-3 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-500 text-emerald-950 text-[11px] leading-relaxed flex items-start gap-2">
                          <MessageSquare size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>
                            To post a campaign (like an affiliate or TikTok shop), at least one creative
                            must include a posting. Subsequent creatives can be without posting.
                          </span>
                        </div>
                      </div>

                      {/* 3. Brand Tag Input */}
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <label className="text-xs font-bold text-gray-900">
                            Should the Creator tag your Brand?
                          </label>
                          <span className="text-[11px] text-gray-400">(optional)</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-1.5">Add your Brand handle.</p>
                        <input
                          type="text"
                          value={deliv.brandTag || ""}
                          onChange={(e) => handleDeliverableChange(idx, "brandTag", e.target.value)}
                          placeholder="Example: @brand"
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                        />
                      </div>

                      {/* 4. Hashtags Input */}
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <label className="text-xs font-bold text-gray-900">
                            Should the Creator add any hashtags?
                          </label>
                          <span className="text-[11px] text-gray-400">(optional)</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-1.5">
                          Write the hashtags that you would like the creator to add.
                        </p>
                        <input
                          type="text"
                          value={deliv.hashtags || ""}
                          onChange={(e) => handleDeliverableChange(idx, "hashtags", e.target.value)}
                          placeholder="Example: #PlanCalm"
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                        />
                      </div>

                      {/* Number of Photos (Photo media type only) */}
                      {deliv.mediaType === "Photo" && (
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1">
                            Number of Photos
                          </label>
                          <p className="text-[11px] text-gray-500 mb-2">
                            How many photos should each creator produce for you?
                          </p>
                          <div className="flex items-center border border-gray-200 rounded-xl max-w-[140px] bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                handleDeliverableChange(
                                  idx,
                                  "numberOfPhotos",
                                  Math.max(1, (deliv.numberOfPhotos || 1) - 1)
                                )
                              }
                              className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              —
                            </button>
                            <span className="flex-1 text-center text-xs font-bold text-gray-900">
                              {deliv.numberOfPhotos || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeliverableChange(
                                  idx,
                                  "numberOfPhotos",
                                  (deliv.numberOfPhotos || 1) + 1
                                )
                              }
                              className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 5. Placement */}
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          Placement
                        </label>
                        <p className="text-[11px] text-gray-500 mb-2">
                          Choose where the content is required to be posted once it is ready.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {["Stories", "Feed", "Reels"].map((pl) => (
                            <button
                              key={pl}
                              type="button"
                              onClick={() => handleDeliverableChange(idx, "placement", pl)}
                              className={`py-3 px-3 rounded-2xl border text-xs font-bold transition text-center ${
                                deliv.placement === pl
                                  ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                  : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              {pl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 6. Format (Dimensions) */}
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">
                          Format
                        </label>
                        <p className="text-[11px] text-gray-500 mb-2">
                          Select the desired dimensions for the image / video content.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {FORMAT_OPTIONS.map((fmt) => {
                            const isSelected = deliv.format === fmt.id;
                            const IconComponent = fmt.icon;
                            return (
                              <div
                                key={fmt.id}
                                onClick={() => handleDeliverableChange(idx, "format", fmt.id)}
                                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center min-h-[85px] ${
                                  isSelected
                                    ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950 font-bold"
                                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                                }`}
                              >
                                <IconComponent size={20} className="mb-1 text-gray-700" />
                                <span className="text-xs whitespace-pre-line leading-tight">
                                  {fmt.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Video Length & Raw Options (Video only) */}
                      {deliv.mediaType === "Video" && (
                        <>
                          {/* Video length */}
                          <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1">
                              Video length
                            </label>
                            <p className="text-[11px] text-gray-500 mb-2">
                              Select the duration of your creative asset
                            </p>
                            <div className="flex items-center gap-3 max-w-xs">
                              <div className="relative flex-1">
                                <input
                                  type="number"
                                  min="5"
                                  value={deliv.videoMinLength || 15}
                                  onChange={(e) =>
                                    handleDeliverableChange(
                                      idx,
                                      "videoMinLength",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-center pr-9 bg-white"
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-gray-400">
                                  sec
                                </span>
                              </div>
                              <span className="text-gray-400 font-bold">—</span>
                              <div className="relative flex-1">
                                <input
                                  type="number"
                                  min="10"
                                  value={deliv.videoMaxLength || 60}
                                  onChange={(e) =>
                                    handleDeliverableChange(
                                      idx,
                                      "videoMaxLength",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-center pr-9 bg-white"
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-gray-400">
                                  sec
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Raw / Ready to use */}
                          <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1">
                              Raw / Ready to use
                            </label>
                            <p className="text-[11px] text-gray-500 mb-2">
                              Let the creators know if you need the final (ready-to-use) version of the
                              video, only the raw footage, or maybe both!
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {[
                                "Raw footage",
                                "Ready to use Ad",
                                "Ready to use Ad + Raw footage",
                              ].map((option) => {
                                const isSelected = deliv.rawOrReady === option;
                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() =>
                                      handleDeliverableChange(idx, "rawOrReady", option)
                                    }
                                    className={`p-3 rounded-2xl border text-[11px] font-bold transition flex items-center justify-center gap-1 text-center ${
                                      isSelected
                                        ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    <span>{option}</span>
                                    <Info size={12} className="text-gray-400 flex-shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Content Type (Opens when raw/ready is selected) */}
                          {deliv.rawOrReady && (
                            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4 animate-fadeIn">
                              <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1">
                                  Content type
                                </label>
                                <p className="text-[11px] text-gray-500 mb-3">
                                  Specify what type of video you need for your campaign. For a description
                                  of each video type click here
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                  {PRIMARY_CONTENT_TYPES.map((ct) => {
                                    const isSelected = deliv.contentType === ct;
                                    return (
                                      <div
                                        key={ct}
                                        onClick={() =>
                                          handleDeliverableChange(idx, "contentType", ct)
                                        }
                                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs font-medium ${
                                          isSelected
                                            ? "border-fuchsia-600 bg-fuchsia-50/40 ring-1 ring-fuchsia-600 font-bold text-gray-950"
                                            : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                                        }`}
                                      >
                                        <span>{ct}</span>
                                        <Info size={13} className="text-gray-400" />
                                      </div>
                                    );
                                  })}

                                  {deliv.showExtraContentTypes &&
                                    EXTRA_CONTENT_TYPES.map((ct) => {
                                      const isSelected = deliv.contentType === ct;
                                      return (
                                        <div
                                          key={ct}
                                          onClick={() =>
                                            handleDeliverableChange(idx, "contentType", ct)
                                          }
                                          className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs font-medium ${
                                            isSelected
                                              ? "border-fuchsia-600 bg-fuchsia-50/40 ring-1 ring-fuchsia-600 font-bold text-gray-950"
                                              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                                          }`}
                                        >
                                          <span>{ct}</span>
                                          <Info size={13} className="text-gray-400" />
                                        </div>
                                      );
                                    })}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeliverableChange(
                                      idx,
                                      "showExtraContentTypes",
                                      !deliv.showExtraContentTypes
                                    )
                                  }
                                  className="mt-3 text-xs font-bold text-fuchsia-700 hover:underline"
                                >
                                  {deliv.showExtraContentTypes
                                    ? "See less options"
                                    : "See 6 more options"}
                                </button>
                              </div>

                              {/* Step-by-step guide for the creator */}
                              <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                                  Give a step-by-step guide for the creator
                                </label>
                                <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 bg-white">
                                  <textarea
                                    rows={8}
                                    value={deliv.creatorGuide || ""}
                                    onChange={(e) =>
                                      handleDeliverableChange(idx, "creatorGuide", e.target.value)
                                    }
                                    className="w-full p-3.5 text-xs text-gray-900 font-mono focus:outline-none resize-none leading-relaxed"
                                  />
                                  {/* Formatting bar */}
                                  <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 flex items-center gap-1.5 text-gray-600">
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "left")}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                      title="Align Left"
                                    >
                                      <AlignLeft size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "center")}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                      title="Align Center"
                                    >
                                      <AlignCenter size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "right")}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                      title="Align Right"
                                    >
                                      <AlignRight size={15} />
                                    </button>
                                    <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "bold")}
                                      className="p-1 rounded hover:bg-gray-200 font-bold text-gray-600"
                                      title="Bold"
                                    >
                                      <Bold size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "italic")}
                                      className="p-1 rounded hover:bg-gray-200 italic text-gray-600"
                                      title="Italic"
                                    >
                                      <Italic size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "underline")}
                                      className="p-1 rounded hover:bg-gray-200 underline text-gray-600"
                                      title="Underline"
                                    >
                                      <Underline size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "strike")}
                                      className="p-1 rounded hover:bg-gray-200 line-through text-gray-600"
                                      title="Strikethrough"
                                    >
                                      <Strikethrough size={15} />
                                    </button>
                                    <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "bullet")}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                      title="Bullet"
                                    >
                                      <List size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "numbered")}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                      title="Numbered"
                                    >
                                      <ListOrdered size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFormatText(idx, "link")}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                      title="Link"
                                    >
                                      <Link2 size={15} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <p className="text-[11px] text-indigo-700 flex items-center gap-1">
                                <Lightbulb size={13} className="flex-shrink-0" />
                                <span>
                                  If your brief needs clips, list them here — not in the description —
                                  so creators know exactly what to deliver
                                </span>
                              </p>

                              {/* Request hooks, b-rolls and more */}
                              <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                                  <Film size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs text-gray-950">
                                      Request hooks, b-rolls and more
                                    </h4>
                                    <span className="bg-pink-100 text-pink-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                                      New
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                                    Get clips such as different hooks, b-rolls, or scene variations. Mix,
                                    match, and test new ad variants.
                                  </p>
                                </div>

                                <div
                                  onClick={() =>
                                    handleDeliverableChange(
                                      idx,
                                      "requestHooksAndBRolls",
                                      !deliv.requestHooksAndBRolls
                                    )
                                  }
                                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
                                    deliv.requestHooksAndBRolls ? "bg-fuchsia-600" : "bg-gray-300"
                                  }`}
                                >
                                  <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                                      deliv.requestHooksAndBRolls ? "translate-x-5" : "translate-x-0"
                                    }`}
                                  />
                                </div>
                              </div>

                              {/* Music requirement */}
                              <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1">
                                  Music
                                </label>
                                <p className="text-[11px] text-gray-500 mb-2">
                                  Do you want the Creator to add music?
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                  {["No music", "Music required"].map((m) => (
                                    <button
                                      key={m}
                                      type="button"
                                      onClick={() =>
                                        handleDeliverableChange(idx, "musicRequirement", m)
                                      }
                                      className={`py-3 px-4 rounded-2xl border text-xs font-bold transition text-center ${
                                        deliv.musicRequirement === m
                                          ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                                      }`}
                                    >
                                      {m}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* What should creators avoid? */}
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <label className="text-xs font-bold text-gray-900">
                                    What should creators avoid?
                                  </label>
                                  <span className="text-[11px] text-gray-400">(optional)</span>
                                </div>
                                <p className="text-[11px] text-gray-500 mb-1.5">
                                  Is there anything specific that you don't want the Creator to do?
                                </p>
                                <input
                                  type="text"
                                  value={deliv.whatShouldAvoid || ""}
                                  onChange={(e) =>
                                    handleDeliverableChange(idx, "whatShouldAvoid", e.target.value)
                                  }
                                  placeholder=""
                                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                />
                              </div>

                              {/* References (optional) */}
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <label className="text-xs font-bold text-gray-900">
                                    References
                                  </label>
                                  <span className="text-[11px] text-gray-400">(optional)</span>
                                </div>
                                <p className="text-[11px] text-gray-500 mb-2">
                                  Provide examples of similar content that you like.
                                </p>
                                <div className="border-2 border-dashed border-gray-300 hover:border-fuchsia-500 rounded-2xl p-6 text-center cursor-pointer bg-white transition flex flex-col items-center justify-center gap-1.5">
                                  <UploadCloud size={24} className="text-gray-400" />
                                  <p className="text-xs text-gray-600 font-medium">
                                    Drag and drop file here or{" "}
                                    <span className="text-fuchsia-600 underline">choose file</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Bottom action bar of deliverable card */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteDeliverable(idx)}
                            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete deliverable"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateDeliverable(idx)}
                            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition"
                            title="Duplicate deliverable"
                          >
                            <Copy size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            alert(`Deliverable asset #${idx + 1} saved!`);
                          }}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* + Add Deliverable button */}
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 hover:border-fuchsia-400 bg-white hover:bg-fuchsia-50/30 text-xs font-bold text-gray-800 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus size={16} className="text-fuchsia-600" /> Add Deliverable
                  </button>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 5: PAYMENT TERMS */}
              {/* ======================================================== */}
              {currentStep === 5 && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
                    Payment terms
                  </h3>

                  {/* Fee range per creator */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                      Fee range per creator
                    </label>
                    <div className="flex items-center gap-3 max-w-md">
                      <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 flex-1">
                        <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500 text-xs font-bold">
                          $
                        </div>
                        <input
                          type="number"
                          value={minFeePerCreator}
                          onChange={(e) => setMinFeePerCreator(e.target.value)}
                          placeholder="Min"
                          className="w-full px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none"
                        />
                      </div>
                      <span className="text-gray-400 font-bold">—</span>
                      <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 flex-1">
                        <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500 text-xs font-bold">
                          $
                        </div>
                        <input
                          type="number"
                          value={maxFeePerCreator}
                          onChange={(e) => setMaxFeePerCreator(e.target.value)}
                          placeholder="Max"
                          className="w-full px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sales commissions container card */}
                  <div className="border border-fuchsia-200 rounded-3xl p-5 bg-white space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center text-fuchsia-600 flex-shrink-0 mt-0.5">
                          <Tag size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-950">Sales commissions</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                            Offer a sales commission to further motivate creators. Send it via “Make an
                            extra payment” in chat—we won’t process it.
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setSalesCommissionsEnabled(!salesCommissionsEnabled)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
                          salesCommissionsEnabled ? "bg-fuchsia-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                            salesCommissionsEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>

                    {salesCommissionsEnabled && (
                      <div className="pt-3 border-t border-gray-100 space-y-3 animate-fadeIn">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1">
                            Commission rate
                          </label>
                          <p className="text-[11px] text-gray-500 mb-2">
                            Set % per sale—pay manually in chat, not processed automatically.
                          </p>

                          <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 max-w-sm">
                            <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500 text-xs font-bold">
                              %
                            </div>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={commissionRate}
                              onChange={(e) => setCommissionRate(e.target.value)}
                              placeholder="10"
                              className="w-full px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Green recommendation banner */}
                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-500 text-emerald-950 text-[11px] leading-relaxed flex items-start gap-2">
                          <MessageSquare size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>
                            To ensure optimal performance of the campaign, we recommend setting the
                            commission rate at 10% or higher
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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

      {/* Sub-Modals for Brand and Product */}
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

            <h3 className="text-lg font-extrabold text-gray-950">
              Sample Creator Brief ({campaignType})
            </h3>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 font-medium">
                🎯 <strong>Goal:</strong> {campaignGoal} on {platform}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-900">Key Hooks & Angle:</p>
                <p>• Showcase genuine problem-solving scenario within the first 3 seconds.</p>
                <p>• Highlight unboxing / textures / instant results in natural lighting.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-900">Do's & Don'ts:</p>
                <p>• DO speak conversationally and tag the brand account.</p>
                <p>• DON'T use robotic scripts or mention direct competitors.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-900">Usage Rights:</p>
                <p>• 90-day organic and paid partnership ads usage on {platform}.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBriefSampleModal(false)}
              className="w-full py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
