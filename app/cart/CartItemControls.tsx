"use client";

import React from "react";
import { updateCartItemQuantity, removeFromCart } from "@/features/cart/actions";

async function handleUpdateQuantity(formData: FormData): Promise<void> {
  await updateCartItemQuantity(formData);
}
async function handleRemove(formData: FormData): Promise<void> {
  await removeFromCart(formData);
}

interface Props {
  itemId: string;
  quantity: number;
}

import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItemControls({ itemId, quantity }: Props) {
  return (
    <div className="flex items-center gap-4">
      {/* Modern Quantity Pill */}
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1 shadow-sm">
        <form action={handleUpdateQuantity}>
          <input type="hidden" name="cartItemId" value={itemId} />
          <input type="hidden" name="delta" value={-1} />
          <button
            type="submit"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all disabled:opacity-50"
            aria-label="Disminuir cantidad"
            disabled={quantity <= 1}
          >
            <Minus size={14} strokeWidth={3} />
          </button>
        </form>

        <span className="w-8 text-center font-bold text-gray-900 text-sm select-none">
          {quantity}
        </span>

        <form action={handleUpdateQuantity}>
          <input type="hidden" name="cartItemId" value={itemId} />
          <input type="hidden" name="delta" value={1} />
          <button
            type="submit"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
            aria-label="Aumentar cantidad"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </form>
      </div>

      {/* Modern Delete Icon */}
      <form action={handleRemove}>
        <input type="hidden" name="cartItemId" value={itemId} />
        <button
          type="submit"
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          aria-label="Eliminar producto"
        >
          <Trash2 size={20} />
        </button>
      </form>
    </div>
  );
}
