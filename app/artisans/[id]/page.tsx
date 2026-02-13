import styles from "../../page-01.module.css";
import { getProductById } from "@/features/products/queries";
// Importamos notFound para manejar errores de Next.js correctamente
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. Eliminamos el tipado estricto en la declaración
  const product = await getProductById(id);

  // 2. Validación de existencia (Type Guard)
  // Si el producto no existe en MongoDB, mostramos la página 404 de Next.js
  if (!product) {
    notFound();
  }

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
                <button type="button" className={styles.qtyBtn}>
                  {" "}
                  -{" "}
                </button>
                <input
                  type="number"
                  className={styles.qtyInput}
                  defaultValue={1}
                />
                <button type="button" className={styles.qtyBtn}>
                  {" "}
                  +{" "}
                </button>
              </div>
            </div>

            <button className={styles.addButton}>Añadir al Carrito</button>

            {/* 3. Corrección de Propiedades: Usamos el objeto 'seller' */}
            <div className={styles.creator}>
              <img
                src={
                  product.seller?.profileImage || "/images/default-avatar.webp"
                }
                alt={product.seller?.name || "Artesano"}
                className={styles.avatar}
              />
              <div>
                <p className={styles.creatorBy}>
                  {product.seller?.name || "Artesano independiente"}
                </p>
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

            {/* Reseña de ejemplo estática */}
            <div className={styles.creator}>
              <img
                src="/images/carlos_profile.webp"
                alt="Author"
                className={styles.avatar}
              />
              <div>
                <p className={styles.opinionGiver}>Carlos</p>
                <p className={styles.dateGiver}>13 Oct 2025</p>
                <p className={styles.creatorBy}>
                  I am absolutely obsessed with this clay vase. You can tell
                  it’s high-quality just by the weight...
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
