import React from "react";
import Image from "next/image";
import styles from "../page-01.module.css";
import { getCart, clearCart } from "@/features/cart/actions";
import { getProductById } from "@/features/products/queries";
import Link from "next/link";
import CartItemControls from "./CartItemControls";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Carrito | Artisanal Refuge",
  description: "Tu selección de piezas artesanales únicas listas para ir a casa.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function handleClearCart(): Promise<void> {
  "use server";
  await clearCart();
}

import OrderCartTabs from "@/app/ui/cart/OrderCartTabs";
import { Trash2, CreditCard, ShoppingCart, Package } from "lucide-react";

export default async function CartPage() {
  let cart = null;
  try {
    cart = await getCart();
  } catch (error) {
    console.error("Error fetching cart:", error);
  }

  const items = cart?.items || [];
  const itemsWithProduct = await Promise.all(
    items.map(async (item) => {
      const product = await getProductById(item.productId);
      return { item, product };
    }),
  );

  const total = itemsWithProduct.reduce((sum, { item, product }) => {
    const price = product?.price || 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#F7F3E7] py-8 px-4 sm:px-8 lg:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <OrderCartTabs />

        <div className="flex flex-col gap-8">
          {/* HEADER & TOP SUMMARY */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#EADDCA] pb-8">
            <div>
              <h1 className="text-4xl font-black text-[#283618] tracking-tight">Tu Selección</h1>
              <p className="text-[#5C4033]/60 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">
                {itemsWithProduct.length} {itemsWithProduct.length === 1 ? 'Pieza Única' : 'Piezas Únicas'}
              </p>
            </div>

            {itemsWithProduct.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 bg-white/50 p-2 rounded-[2rem] border border-[#EADDCA]/50 shadow-sm backdrop-blur-sm">
                <div className="px-6 py-2">
                  <p className="text-[9px] uppercase tracking-widest font-black text-[#BC6C25]/60 mb-0.5">Total Estimado</p>
                  <p className="text-2xl font-black text-[#283618] leading-none">${total.toFixed(2)}</p>
                </div>
                <Link
                  href={"/checkout" as any}
                  className="bg-[#BC6C25] hover:bg-[#8D5F42] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 transition-all shadow-lg shadow-[#BC6C25]/20 active:scale-95"
                >
                  <CreditCard size={18} /> Pagar Ahora
                </Link>
              </div>
            )}
          </div>

          {itemsWithProduct.length === 0 ? (
            <div className="text-center py-20 bg-[#FDFBF7] rounded-[3rem] border border-[#EADDCA] shadow-[0_20px_40px_-20px_rgba(141,95,66,0.1)]">
              <div className="bg-[#EADDCA]/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <ShoppingCart className="w-12 h-12 text-[#BC6C25]/30" />
              </div>
              <h2 className="text-3xl font-black text-[#283618] mb-3 tracking-tight">Tu carrito está esperando</h2>
              <p className="text-[#5C4033]/60 mb-10 max-w-sm mx-auto font-medium">El arte y la tradición no deberían esperar. Descubre algo especial hoy.</p>
              <Link href="/artisans" className="bg-[#8D5F42] text-white px-10 py-4 rounded-full font-black hover:bg-[#704a33] transition-all shadow-xl shadow-[#8D5F42]/20">
                Explorar Colecciones
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* CLEAR CART OPTION */}
              <div className="flex justify-end">
                <form action={handleClearCart}>
                  <button
                    type="submit"
                    className="text-[#BC6C25]/60 hover:text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors px-4 py-2 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={12} /> Vaciar Mi Carrito
                  </button>
                </form>
              </div>

              {/* PRODUCT LIST - Minimalist Full Width Rows */}
              <div className="flex flex-col gap-4">
                {itemsWithProduct.map(({ item, product }) => (
                  <article
                    key={item.id}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 bg-[#FDFBF7] rounded-[2rem] border border-[#E6DAB5]/40 shadow-sm hover:shadow-md transition-all duration-500 group"
                  >
                    {/* Compact Image */}
                    <div className="w-20 h-20 relative flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-[#EADDCA]/30 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {product?.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <Package className="w-8 h-8 text-gray-200" />
                        </div>
                      )}
                    </div>

                    {/* Title and Base Price - Distributed across row on desktop */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-black text-[#283618] leading-tight truncate">
                        {product?.title || "Pieza Artesanal"}
                      </h2>
                      <p className="text-[#BC6C25]/70 text-[10px] uppercase font-black tracking-widest mt-0.5">
                        ${product?.price?.toFixed(2) || "0.00"} unitario
                      </p>
                    </div>

                    {/* Controls & Subtotal */}
                    <div className="flex items-center gap-12 w-full md:w-auto">
                      <div className="bg-white/50 p-1 rounded-2xl border border-[#EADDCA]/30 shadow-sm">
                        <CartItemControls
                          itemId={item.id}
                          quantity={item.quantity || 0}
                        />
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-[9px] uppercase tracking-tighter font-black text-[#8D5F42]/40">Subtotal</p>
                        <p className="text-xl font-black text-[#283618] tracking-tight">
                          ${((product?.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
