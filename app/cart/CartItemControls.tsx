"use client";

import React from "react";
import { updateCartItemQuantity, removeFromCart } from "@/features/cart/actions";

interface Props {
  itemId: string;
  quantity: number;
}

export default function CartItemControls({ itemId, quantity }: Props) {
  return (
    <div className="flex items-center gap-2">
      <form action={updateCartItemQuantity} className="inline">
        <input type="hidden" name="cartItemId" value={itemId} />
        <input type="hidden" name="delta" value={-1} />
        <button type="submit" className="px-2 py-1 bg-gray-200 rounded">-</button>
      </form>

      <div className="px-3 py-1 border rounded">{quantity}</div>

      <form action={updateCartItemQuantity} className="inline">
        <input type="hidden" name="cartItemId" value={itemId} />
        <input type="hidden" name="delta" value={1} />
        <button type="submit" className="px-2 py-1 bg-gray-200 rounded">+</button>
      </form>

      <form action={removeFromCart} className="inline">
        <input type="hidden" name="cartItemId" value={itemId} />
        <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
      </form>
    </div>
  );
}
