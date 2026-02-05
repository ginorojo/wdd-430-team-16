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

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className={styles.pageBackground}>
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

            <div className={styles.reviews}>
              <h3 className={styles.sectionTitle}>Reseñas</h3>
              <div className={styles.starsRow}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.reviewBars}>
                  <div className={styles.bar} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
