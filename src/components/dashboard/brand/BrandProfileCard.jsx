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
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-5 h-full">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={companyName} />
          {verified && (
            <span className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] rounded-full p-0.5 border-2 border-[var(--color-surface)]">
              <BadgeCheck size={14} className="text-white" />
            </span>
          )}
        </div>
        <div>
          <span className="font-bold text-[var(--color-text)] text-lg">{companyName}</span>
          <p className="text-xs text-[var(--color-text-light)]">{industry}</p>
        </div>
      </div>

      <div className="flex items-center justify-around text-center">
        <div>
          <div className="font-bold text-[var(--color-text)]">{campaignsRun}</div>
          <div className="text-xs text-[var(--color-text-light)]">campaigns run</div>
        </div>
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div>
          <div className="font-bold text-[var(--color-text)]">{creatorsPartnered}</div>
          <div className="text-xs text-[var(--color-text-light)]">creators partnered</div>
        </div>
      </div>

      {!verified && (
        <div className="text-sm text-[var(--color-warning)] bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-xl px-4 py-2.5">
          Your brand has not been verified yet.
        </div>
      )}

      {/* Products */}
      <div className="border-t border-[var(--color-border)] pt-5">
        <div className="flex items-center gap-2 mb-3">
          <Package size={16} className="text-[var(--color-primary)]" />
          <h4 className="text-sm font-bold text-[var(--color-text)]">Products</h4>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-[var(--color-text-light)]">
            No products added yet. Use Product Information below to add one.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <select
                value={selectedProductId || ""}
                onChange={(e) => onSelectProduct(e.target.value)}
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
                className="flex-shrink-0 p-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => onRemoveProduct(selectedProductId)}
                disabled={removing}
                aria-label="Remove product"
                title="Remove product"
                className="flex-shrink-0 p-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {selectedProduct && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 flex flex-col gap-3">

                {/* Name + Price */}
                <div className="flex items-start justify-between gap-3">
                  <h5 className="font-bold text-[var(--color-text)] leading-snug">
                    {selectedProduct.productName}
                  </h5>
                  {formattedPrice && (
                    <span className="flex-shrink-0 text-sm font-bold text-white bg-[var(--color-primary)] px-2.5 py-1 rounded-full">
                      ₹{formattedPrice}
                    </span>
                  )}
                </div>

                {/* Category */}
                {selectedProduct.productCategory && (
                  <span className="w-fit text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]">
                    {selectedProduct.productCategory}
                  </span>
                )}

                {/* Description — bold label, bulleted points */}
                {descriptionPoints.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text)] mb-1.5">
                      Description
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {descriptionPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[var(--color-text-light)] leading-relaxed"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target audience badges */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-[var(--color-border)]/60 mt-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-full">
                    <Users size={12} className="text-[var(--color-primary)]" />
                    {selectedProduct.targetGender || "All"}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-full">
                    <Calendar size={12} className="text-[var(--color-primary)]" />
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