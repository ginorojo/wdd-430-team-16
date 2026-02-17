'use client';

import { useState } from 'react';
import { addToCart } from '@/features/cart/actions';
import { useRouter } from 'next/navigation';

interface AddToCartFormProps {
  productId: string;
}

export default function AddToCartForm({ productId }: AddToCartFormProps) {
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
        setTimeout(() => router.push('/login' as any), 2000);
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
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9">
            <button
              type="button"
              className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors disabled:opacity-50 h-full"
              aria-label="decrease"
              onClick={handleDecrease}
              disabled={loading || quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              className="w-10 text-center border-x border-gray-300 text-sm font-medium focus:outline-none h-full"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              aria-label="quantity"
              disabled={loading}
              min="1"
            />
            <button
              type="button"
              className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors disabled:opacity-50 h-full"
              aria-label="increase"
              onClick={handleIncrease}
              disabled={loading}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        className="w-full py-3 bg-[#BC6C25] hover:bg-[#a05b1f] text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs mt-3 font-medium ${message.type === 'success'
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
