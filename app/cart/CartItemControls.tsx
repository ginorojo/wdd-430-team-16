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

export default function CartItemControls({ itemId, quantity }: Props) {
  return (
    <div className="flex items-center gap-2">
      <form action={handleUpdateQuantity} className="inline">
        <input type="hidden" name="cartItemId" value={itemId} />
        <input type="hidden" name="delta" value={-1} />
        <button type="submit" className="px-2 py-1 bg-gray-300 text-gray-900 font-bold rounded">-</button>
      </form>

      <div className="px-3 py-1 border border-gray-400 rounded font-semibold text-gray-900">{quantity}</div>

      <form action={handleUpdateQuantity} className="inline">
        <input type="hidden" name="cartItemId" value={itemId} />
        <input type="hidden" name="delta" value={1} />
        <button type="submit" className="px-2 py-1 bg-gray-300 text-gray-900 font-bold rounded">+</button>
      </form>

      <form action={handleRemove} className="inline">
        <input type="hidden" name="cartItemId" value={itemId} />
        <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
      </form>
    </div>
  );
}
