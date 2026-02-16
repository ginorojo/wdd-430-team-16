/**
 * @file page.tsx
 * @description Product detail page - loads product data dynamically based on ID
 */

import React from "react";
import Image from "next/image";
import { getProductById } from "@/features/products/queries";
import { notFound } from "next/navigation";
import AddToCartForm from "./AddToCartForm";
import ReviewSection from "./ReviewSection";
import * as motion from "framer-motion/client";
import { ResolvingMetadata } from "next";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic Metadata for SEO
 */
export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<any> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.title} | Artisanal Refuge`,
    description: product.description || `Adquiere ${product.title} en Artisanal Refuge. Piezas artesanales únicas hechas a mano.`,
    openGraph: {
      title: `${product.title} | Artisanal Refuge`,
      description: product.description || `Adquiere ${product.title} en Artisanal Refuge.`,
      images: [{ url: product.image }],
    },
  };
}

/**
 * ProductPage Component
 * 
 * High-premium product detail view.
 * Mobile-first: 1 column vertical stack.
 * Desktop: 3-column "single view" layout.
 */
const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const seller = product.seller;

  return (
    <div className="bg-[#fcfbf7] min-h-screen lg:h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 lg:p-8 overflow-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": product.image,
            "description": product.description || "Unique artisanal piece",
            "brand": { "@type": "Brand", "name": "Artisanal Refuge" },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          }),
        }}
      />

      <main className="w-full h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">

        {/* COLUMN 1: VISUAL (Dominant 5/12) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 h-[50vh] lg:h-full w-full relative rounded-[32px] overflow-hidden shadow-2xl shadow-[#283618]/5 group"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
        </motion.div>

        {/* COLUMN 2: COMMERCE (Centered 4/12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-4 flex flex-col justify-center h-full py-4 lg:py-12 px-2"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full border border-[#BC6C25]/20 text-[10px] font-black uppercase tracking-widest text-[#BC6C25] bg-white">
                {product.category}
              </span>
              {product.price > 500 && (
                <span className="px-3 py-1 rounded-full bg-[#283618] text-[10px] font-black uppercase tracking-widest text-[#FEFAE0]">
                  Premium
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-[#283618] leading-[0.95] tracking-tight mb-4">
              {product.title}
            </h1>
            <p className="text-3xl font-bold text-[#BC6C25] tracking-tight">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Story */}
          <div className="mb-10 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#E5E5E5]" />
            <div className="pl-6">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#606c38]/60 mb-2 block">The Details</span>
              <p className="text-sm leading-relaxed text-[#4a5a3a] font-medium opacity-80 line-clamp-4">
                {product.description || "Crafted with precision and care, this piece represents the pinnacle of artisanal mastery. Each curve and joinery tells a story of tradition preserved through generations."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto lg:mt-0 space-y-8">
            <AddToCartForm productId={product.id} />

            {seller && (
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md transition-transform group-hover:scale-110">
                  <Image
                    src={seller.profileImage || "/images/default_pfp.webp"}
                    alt={seller.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#BC6C25] mb-0.5">Created By</p>
                  <p className="text-sm font-bold text-[#283618] group-hover:text-[#BC6C25] transition-colors">{seller.name}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* COLUMN 3: COMMUNITY (Sidebar 3/12) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-3 h-full bg-white rounded-[24px] p-6 lg:overflow-y-auto lg:scrollbar-thin shadow-xl shadow-[#283618]/5 border border-[#f0ede7]"
        >
          <ReviewSection productId={product.id} />
        </motion.div>

      </main>
    </div>
  );
};

export default ProductPage;
