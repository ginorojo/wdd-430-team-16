import React from "react";
import Image from "next/image";
import styles from "../page-01.module.css";
import { getCart, clearCart } from "@/features/cart/actions";
import { getProductById } from "@/features/products/queries";
import CartItemControls from "./CartItemControls";

async function handleClearCart(): Promise<void> {
  'use server';
  await clearCart();
}

export default async function CartPage() {
  const cart = await getCart();

  if (!cart) {
    return (
      <main className={styles.pageBackground}>
        <div className={styles.container}>
          <h1 className="text-2xl font-semibold">Tu carrito está vacío</h1>
        </div>
      </main>
    );
  }

  // Load products for each cart item
  const itemsWithProduct = await Promise.all(
    (cart.items || []).map(async (item) => {
      const product = await getProductById(item.productId);
      return { item, product };
    })
  );

  const total = itemsWithProduct.reduce((sum, { item, product }) => {
    const price = product?.price || 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  return (
    <main className={styles.pageBackground}>
      <div className={styles.container}>
        <h1 className="text-2xl font-semibold mb-4">Tu carrito</h1>

        <div className="space-y-4">
          {itemsWithProduct.length === 0 && (
            <div className="p-4 bg-white rounded shadow">No hay artículos en el carrito.</div>
          )}

          {itemsWithProduct.map(({ item, product }) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded shadow">
              <div className="w-24 h-24 relative">
                {product?.image ? (
                  <Image src={product.image} alt={product.title} fill className="object-cover rounded" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded" />
                )}
              </div>

              <div className="flex-1">
                <h2 className="font-semibold">{product?.title || 'Producto desconocido'}</h2>
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                <p className="text-sm text-gray-800">Precio: ${product?.price ?? '0.00'}</p>
                <p className="text-sm text-gray-800">Subtotal: ${(product?.price || 0) * (item.quantity || 0)}</p>
              </div>

              <div className="">
                <CartItemControls itemId={item.id} quantity={item.quantity || 0} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white rounded shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          </div>

          <div>
            <form action={handleClearCart}>
              <button type="submit" className="px-4 py-2 mr-2 bg-red-600 text-white rounded">Vaciar carrito</button>
            </form>
            <button className="px-4 py-2 bg-green-600 text-white rounded">Proceder al pago</button>
          </div>
        </div>
      </div>
    </main>
  );
}
