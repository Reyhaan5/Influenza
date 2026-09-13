import React from "react";
import Avatar from "../influencer/Avatar";
import { BadgeCheck, Package, Trash2, Pencil, Users, Calendar } from "lucide-react";

function formatPrice(price) {
  const num = Number(price);
  if (!num || isNaN(num)) return null;
  return num.toLocaleString("en-IN");
}

function formatAge(product) {
  if (!product) return "";
  if (product.targetAgeGroup === "Custom") {
    return product.targetAgeCustom || "Custom";
  }
  return product.targetAgeGroup;
}

// Splits the saved description into individual bullet points —
// one per line, ignoring any blank lines.
function getDescriptionPoints(description) {
  if (!description) return [];
  return description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function BrandProfileCard({
  companyName,
  industry,
  campaignsRun,
  creatorsPartnered,
  verified,
  products = [],
  selectedProductId,
  onSelectProduct,
  onEditProduct,
  onRemoveProduct,
  removing,
}) {
  const selectedProduct =
    products.find((p) => p._id === selectedProductId) || null;

  const formattedPrice = selectedProduct ? formatPrice(selectedProduct.productPrice) : null;
  const descriptionPoints = selectedProduct
    ? getDescriptionPoints(selectedProduct.productDescription)
    : [];

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={companyName} />
          {verified && (
            <span className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5 border-2 border-white">
              <BadgeCheck size={14} className="text-white" />
            </span>
          )}
        </div>
        <div>
          <span className="font-black text-zinc-950 text-lg tracking-tight">{companyName}</span>
          <p className="text-xs text-zinc-500 font-medium">{industry}</p>
        </div>
      </div>

      <div className="flex items-center justify-around text-center py-2 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
        <div>
          <div className="font-black text-2xl text-zinc-950">{campaignsRun}</div>
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">campaigns run</div>
        </div>
        <div className="w-px h-8 bg-zinc-200" />
        <div>
          <div className="font-black text-2xl text-zinc-950">{creatorsPartnered}</div>
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">creators partnered</div>
        </div>
      </div>

      {!verified && (
        <div className="text-xs font-semibold text-zinc-700 bg-zinc-100/80 border border-zinc-200 rounded-2xl px-4 py-2.5">
          Your brand has not been verified yet.
        </div>
      )}

      {/* Products */}
      <div className="border-t border-zinc-200/80 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <Package size={16} className="text-zinc-900" />
          <h4 className="text-sm font-black text-zinc-950">Products</h4>
        </div>

        {products.length === 0 ? (
          <p className="text-xs text-zinc-500 font-medium">
            No products added yet. Use Product Information below to add one.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <select
                value={selectedProductId || ""}
                onChange={(e) => onSelectProduct(e.target.value)}
                className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onEditProduct(selectedProduct)}
                aria-label="Edit product"
                title="Edit product"
                className="flex-shrink-0 p-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition shadow-xs cursor-pointer"
              >
                <Pencil size={15} />
              </button>

              <button
                onClick={() => onRemoveProduct(selectedProductId)}
                disabled={removing}
                aria-label="Remove product"
                title="Remove product"
                className="flex-shrink-0 p-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-red-50 hover:border-red-200 text-zinc-400 hover:text-red-600 transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {selectedProduct && (
              <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-4 sm:p-5 flex flex-col gap-3.5">

                {/* Name + Price */}
                <div className="flex items-start justify-between gap-3">
                  <h5 className="font-bold text-zinc-950 text-sm leading-snug">
                    {selectedProduct.productName}
                  </h5>
                  {formattedPrice && (
                    <span className="flex-shrink-0 text-xs font-black text-white bg-zinc-950 px-3 py-1 rounded-full shadow-xs">
                      ₹{formattedPrice}
                    </span>
                  )}
                </div>

                {/* Category */}
                {selectedProduct.productCategory && (
                  <span className="w-fit text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-zinc-800">
                    {selectedProduct.productCategory}
                  </span>
                )}

                {/* Description — bold label, bulleted points */}
                {descriptionPoints.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-zinc-950 mb-1.5 uppercase tracking-wider">
                      Description
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {descriptionPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed font-medium"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-950 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target audience badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200/60 mt-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 px-2.5 py-1 rounded-full">
                    <Users size={12} className="text-zinc-900" />
                    {selectedProduct.targetGender || "All"}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 px-2.5 py-1 rounded-full">
                    <Calendar size={12} className="text-zinc-900" />
                    {formatAge(selectedProduct)}
                  </span>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}