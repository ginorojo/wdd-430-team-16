'use client';

import { useState } from 'react';
import { addToCart } from '@/features/cart/actions';
import { useRouter } from 'next/navigation';

interface AddToCartFormProps {
  productId: string;
  styles: Record<string, string>;
}

export default function AddToCartForm({ productId, styles }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    setLoading(true);
    setMessage(null);

    const result = await addToCart(productId, quantity);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
      if (result.error.includes('iniciar sesión')) {
        setTimeout(() => router.push('/login'), 2000);
      }
    } else if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Producto agregado al carrito' });
      setQuantity(1);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 my-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Cantidad</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="disminuir"
              onClick={handleDecrease}
              disabled={loading || quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              className="w-16 text-center py-2 border-x border-gray-300 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              aria-label="cantidad"
              disabled={loading}
              min="1"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="aumentar"
              onClick={handleIncrease}
              disabled={loading}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button 
        className={`${styles.addButton} disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? 'Agregando...' : 'Añadir al Carrito'}
      </button>

      {message && (
        <div 
          className={`p-3 rounded text-sm mt-3 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
    </>
  );
}
