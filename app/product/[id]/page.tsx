/**
 * @file page.tsx
 * @description Product detail page - loads product data dynamically based on ID
 */

import React from "react";
import Image from "next/image";
import styles from "../../page-01.module.css";
import { getProductById } from "@/features/products/queries";
import { notFound } from "next/navigation";
import AddToCartForm from "./AddToCartForm";
import ReviewSection from "./ReviewSection";

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

  if (!product) return {};

  return {
    title: product.title,
    description: product.description || `Compra ${product.title} en Artisanal Refuge. Piezas únicas hechas a mano.`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className={styles.pageBackground}>
      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": product.image,
            "description": product.description || "Pieza artesanal única",
            "brand": {
              "@type": "Brand",
              "name": "Artisanal Refuge"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          }),
        }}
      />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.left}>
            <Image
              src={product.image}
              alt={product.title}
              className={styles.mainImage}
              width={400}
              height={400}
            />
          </div>

          <aside className={styles.right}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>${product.price.toFixed(2)}</p>

            <AddToCartForm productId={product.id} styles={styles} />

            {product.description && (
              <div className={styles.description}>
                <h3 className={styles.sectionTitle}>Descripción</h3>
                <p>{product.description}</p>
              </div>
            )}
          </aside>
        </div>

        {/* Sección de reseñas */}
        <div className="w-full lg:w-1/2 ml-auto">
          <ReviewSection productId={product.id} />
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
