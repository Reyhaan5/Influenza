import React from "react";
import { Pencil, Trash2, Calendar, Target, Package, Sparkles, Truck } from "lucide-react";
import { API_URL } from "../../../config/api";

export default function CampaignCard({ campaign, onEdit, onDelete, onToggleStatus }) {
  const isOpen = campaign.status === "open";
  const brandObj = campaign.brandEntity;
  const productObj = campaign.product;

  const brandLogo = brandObj?.logo
    ? brandObj.logo.startsWith("http")
      ? brandObj.logo
      : `${API_URL.replace("/api", "")}${brandObj.logo}`
    : "";

  const productImg = productObj?.productImages?.[0] || productObj?.productImage
    ? (productObj.productImages?.[0] || productObj.productImage).startsWith("http")
      ? (productObj.productImages?.[0] || productObj.productImage)
      : `${API_URL.replace("/api", "")}${productObj.productImages?.[0] || productObj.productImage}`
    : "";

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
      <div>
        {/* Top brand header & status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandObj?.name}
                className="w-8 h-8 rounded-xl object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {brandObj?.name ? brandObj.name.slice(0, 2).toUpperCase() : "BR"}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block truncate">
                {brandObj?.name || "Brand"}
              </span>
              <h4 className="font-extrabold text-base text-gray-950 truncate">{campaign.title}</h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(campaign)}
              className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-50 transition"
              aria-label="Edit campaign"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(campaign._id)}
              className="p-2 rounded-xl border border-gray-200 text-red-600 hover:bg-red-50 transition"
              aria-label="Delete campaign"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Product preview snippet if available */}
        {productObj && (
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-100 mb-3">
            {productImg ? (
              <img
                src={productImg}
                alt={productObj.productName}
                className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                <Package size={16} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 truncate">{productObj.productName}</p>
              <p className="text-[10px] text-gray-500 truncate">
                {productObj.productType || "Physical"} · ${productObj.productPrice || 0}
              </p>
            </div>
          </div>
        )}

        {/* Description snippet */}
        {campaign.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {campaign.description}
          </p>
        )}

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-600">
          {campaign.campaignGoal && (
            <span className="flex items-center gap-1 bg-fuchsia-50 text-fuchsia-800 font-semibold px-2.5 py-1 rounded-full border border-fuchsia-200">
              <Sparkles size={11} /> {campaign.campaignGoal}
            </span>
          )}

          {campaign.productDelivery && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full">
              <Truck size={11} /> {campaign.productDelivery}
            </span>
          )}

          {campaign.deadline && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full">
              <Calendar size={11} /> {new Date(campaign.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Status & Toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span
          className={`inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            isOpen
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isOpen ? "Active" : "Closed"}
        </span>

        <button
          onClick={() => onToggleStatus(campaign)}
          className="text-xs font-bold text-fuchsia-700 hover:text-fuchsia-900 hover:underline"
        >
          Mark as {isOpen ? "Closed" : "Active"}
        </button>
      </div>
    </div>
  );
}