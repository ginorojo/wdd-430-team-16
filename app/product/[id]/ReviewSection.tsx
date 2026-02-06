/*
 * app/product/[id]/ReviewSection.tsx
 * - Creado en rama: feature/cart
 * - Server component que muestra el resumen de reseñas (promedio, distribución)
 *   seguido de las 5 reseñas más recientes, y el formulario para dejar una nueva.
 */

import React from 'react';
import Image from 'next/image';
import { getReviewSummary, getRecentReviews } from '@/features/reviews/queries';
import ReviewForm from './ReviewForm';

interface ReviewSectionProps {
  productId: string;
}

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500 tracking-wide">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-amber-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default async function ReviewSection({ productId }: ReviewSectionProps) {
  const [summary, reviews] = await Promise.all([
    getReviewSummary(productId),
    getRecentReviews(productId),
  ]);

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Reseñas</h3>

      {/* ── Resumen ── */}
      <div className="p-4 bg-white rounded-lg shadow mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">
              {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : '—'}
            </p>
            <StarsDisplay rating={summary.averageRating} />
            <p className="text-xs text-gray-600 mt-1">
              {summary.totalReviews} reseña{summary.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Barras de distribución */}
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution[star] || 0;
              const pct = summary.totalReviews > 0 ? Math.round((count / summary.totalReviews) * 100) : 0;
              // Map to closest Tailwind width class
              const widthClass =
                pct === 0 ? 'w-0' :
                pct <= 10 ? 'w-1/12' :
                pct <= 20 ? 'w-1/5' :
                pct <= 25 ? 'w-1/4' :
                pct <= 33 ? 'w-1/3' :
                pct <= 40 ? 'w-2/5' :
                pct <= 50 ? 'w-1/2' :
                pct <= 60 ? 'w-3/5' :
                pct <= 66 ? 'w-2/3' :
                pct <= 75 ? 'w-3/4' :
                pct <= 80 ? 'w-4/5' :
                pct <= 90 ? 'w-11/12' :
                'w-full';
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-right text-gray-700 font-medium">{star}</span>
                  <span className="text-amber-500">★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-amber-500 rounded-full transition-all ${widthClass}`}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-600 text-xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Formulario ── */}
      <ReviewForm productId={productId} />

      {/* ── Lista de reseñas recientes ── */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Reseñas recientes</h4>
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name || 'Usuario'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                      {(review.user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {review.user.name || 'Usuario anónimo'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <StarsDisplay rating={review.rating} />
              <p className="mt-2 text-sm text-gray-800">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">Aún no hay reseñas. ¡Sé el primero!</p>
      )}
    </section>
  );
}
