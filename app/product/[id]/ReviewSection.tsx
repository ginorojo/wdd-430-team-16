/*
 * app/product/[id]/ReviewSection.tsx
 * - Creado en rama: feature/cart
 * - Server component que muestra el resumen de reseñas (promedio, distribución)
 *   seguido de las 5 reseñas más recientes, y el formulario para dejar una nueva.
 */

import React from "react";
import Image from "next/image";
import { getReviewSummary, getRecentReviews } from "@/features/reviews/queries";
import ReviewForm from "./ReviewForm";

interface ReviewSectionProps {
  productId: string;
}

/**
 * Minimal Star Display
 */
function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-[10px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(rating) ? "text-[#BC6C25]" : "text-gray-200"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * ReviewSection Component
 * 
 * An ultra-minimal display of product community feedback.
 * Focused on high data-density and clean typography.
 */
export default async function ReviewSection({ productId }: ReviewSectionProps) {
  const [summary, reviews] = await Promise.all([
    getReviewSummary(productId),
    getRecentReviews(productId),
  ]);

  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#BC6C25]">Community Feedback</h3>

      {/* --- COMPACT SUMMARY --- */}
      <div className="bg-[#fdfaf3] rounded-2xl p-4 flex items-center gap-5">
        <div className="text-center">
          <p className="text-3xl font-black text-[#283618] leading-none mb-1">
            {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : "—"}
          </p>
          <StarsDisplay rating={summary.averageRating} />
          <p className="text-[9px] font-bold text-[#606c38] opacity-60 mt-1">
            ({summary.totalReviews} total)
          </p>
        </div>

        {/* Rating Distribution Bars */}
        <div className="flex-1 flex flex-col gap-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] || 0;
            const pct = summary.totalReviews > 0
              ? Math.round((count / summary.totalReviews) * 100)
              : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-[9px] font-extrabold text-[#283618]">
                <span className="w-1">{star}</span>
                <div className="flex-1 h-1 bg-[#DDA15E]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#BC6C25] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- REVIEWS LIST --- */}
      {reviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-[#f0ede7] pb-4 last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name || "User"}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#fdfaf3] border border-[#DDA15E]/10 flex items-center justify-center text-[#BC6C25] text-[9px] font-black">
                      {(review.user.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-extrabold text-[#283618]">
                    {review.user.name?.split(" ")[0] || "Anonymous"}
                  </span>
                </div>
                <span className="text-[10px] text-[#606c38] opacity-50">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <StarsDisplay rating={review.rating} />
              {review.comment && (
                <p className="text-[13px] leading-relaxed text-[#606c38] mt-1.5 opacity-90">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#606c38] italic opacity-60">No reviews yet. Be the first to share.</p>
      )}

      {/* --- FORM SECTION --- */}
      <div className="mt-2 pt-4 border-t border-[#f0ede7]">
        <ReviewForm productId={productId} />
      </div>
    </section>
  );
}
