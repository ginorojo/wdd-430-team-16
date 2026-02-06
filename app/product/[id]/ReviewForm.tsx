/*
 * app/product/[id]/ReviewForm.tsx
 * - Creado en rama: feature/cart
 * - Formulario cliente para enviar una reseña con estrellas y comentario.
 */

'use client';

import React, { useState } from 'react';
import StarRating from './StarRating';
import { createReview } from '@/features/reviews/actions';

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Selecciona una calificación' });
      return;
    }
    if (!comment.trim()) {
      setMessage({ type: 'error', text: 'Escribe un comentario' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await createReview(productId, rating, comment);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: result.message || 'Reseña publicada' });
      setRating(0);
      setComment('');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
      <h4 className="font-semibold text-gray-900 mb-3">Deja tu reseña</h4>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
        <StarRating rating={rating} onRate={setRating} disabled={loading} />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="review-comment">
          Comentario
        </label>
        <textarea
          id="review-comment"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          rows={3}
          placeholder="Escribe tu opinión sobre este producto..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Enviando...' : 'Publicar reseña'}
      </button>

      {message && (
        <div
          className={`mt-3 p-2 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
