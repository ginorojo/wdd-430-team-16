/*
 * app/product/[id]/StarRating.tsx
 * - Creado en rama: feature/cart
 * - Componente cliente interactivo de 5 estrellas para seleccionar calificación.
 */

'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  onRate: (star: number) => void;
  disabled?: boolean;
}

export default function StarRating({ rating, onRate, disabled = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRate(star)}
          className={`text-2xl transition-colors ${
            star <= rating
              ? 'text-amber-500'
              : 'text-gray-300 hover:text-amber-300'
          } disabled:cursor-not-allowed`}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
