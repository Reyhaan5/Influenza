import React, { useState } from "react";
import { Plus, Pencil, Globe, RefreshCw, ChevronRight } from "lucide-react";
import { API_URL } from "../../../../../config/api";

export default function StepCoreDetails({
  brands = [],
  products = [],
  selectedBrandId,
  setSelectedBrandId,
  campaignName,
  setCampaignName,
  selectedProductId,
  setSelectedProductId,
  setEditingBrand,
  setShowBrandModal,
  setEditingProduct,
  setShowProductModal,
}) {
  const [showProductSelector, setShowProductSelector] = useState(false);

  const selectedBrand = brands.find((b) => b._id === selectedBrandId) || brands[0];
  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${API_URL.replace("/api", "")}${url}`;
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Core Details */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
          Core Details
        </h3>

        {/* Brand Select */}
        <div>
          <label className="block text-xs font-bold text-gray-900 mb-1">Brand</label>
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
                {brands.length === 0 && <option value="">No brands created yet</option>}
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
          <label className="block text-xs font-bold text-gray-900 mb-1">Campaign name</label>
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
        <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">Product</h3>

        {selectedProduct ? (
          <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 relative space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-900 flex-shrink-0 overflow-hidden border border-gray-200">
                {selectedProduct.productImages?.[0] || selectedProduct.productImage ? (
                  <img
                    src={getImageUrl(selectedProduct.productImages?.[0] || selectedProduct.productImage)}
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
                <h4 className="font-bold text-sm text-gray-950 truncate">{selectedProduct.productName}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedProduct.brand?.name || selectedBrand?.name || "Brand"} ·{" "}
                  {selectedProduct.productType || "Physical Product"} · ${selectedProduct.productPrice || 0} retail price
                </p>
                {selectedProduct.productDescription && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{selectedProduct.productDescription}</p>
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
                        src={getImageUrl(prod.productImages?.[0] || prod.productImage)}
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
                    <p className="text-xs font-bold text-gray-900 truncate">{prod.productName}</p>
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
  );
}
