/**
 * @file page.tsx
 * @description Home page component containing the hero banner, popular categories, and featured artisan listings.
 */

import styles from "../../page-01.module.css"
import { getProductById } from "@/features/products/queries";
import { Product } from "@/features/products/types";

export default async function Page(props:{ params: Promise<{ id: string }> }) {

      const { id } = await props.params;
      const product : Product = await getProductById(id)



  return (
    <main className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.left}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.mainImage}
            />
          </div>

          <aside className={styles.right}>
            <h1 className={styles.productTitle}>{product.title}</h1>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>

            <div className={styles.qtyRow}>
              <label className={styles.qtyLabel}>Cantidad</label>
              <div className={styles.qtyControls}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  aria-label="disminuir"
                >
                  -
                </button>
                <input
                  type="number"
                  className={styles.qtyInput}
                  defaultValue={1}
                  aria-label="cantidad"
                />
                <button
                  type="button"
                  className={styles.qtyBtn}
                  aria-label="aumentar"
                >
                  +
                </button>
              </div>
            </div>

            <button className={styles.addButton}>Añadir al Carrito</button>

            <div className={styles.creator}>
              <img
                src={product.authorImage}
                alt={product.author}
                className={styles.avatar}
              />
              <div>
                <p className={styles.creatorBy}> {product.author}</p>
              </div>
            </div>

            <div className={styles.reviews}>
              <h3 className={styles.sectionTitle}>Reseñas</h3>
              <div className={styles.starsRow}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.reviewBars}>
                  <div className={styles.bar} />
                </div>
              </div>
            </div>
            <div className={styles.creator}>
              <img
                src="/images/carlos_profile.png"
                alt="Author"
                className={styles.avatar}
              />
              <div>
                <p className={styles.opinionGiver}>Carlos</p>
                <p className={styles.dateGiver}>13 Oct 2025</p>
                <p className={styles.creatorBy}>I am absolutely obsessed with this clay vase. You can tell it’s high-quality just by the weight and the texture—it has that perfect 'handmade' feel that adds so much character to my living room</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

