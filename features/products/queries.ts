import { prisma } from "@/app/lib/prisma";
import type { Product } from "./types";

/**
 * Fetches all products from the database with seller information.
 * Orders them by creation date (newest first).
 * @returns A list of products with their sellers.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      // 👇 INDISPENSABLE: Sin esto, la tabla Seller no se une a la consulta
      include: {
        seller: true,
      },
    });

    // Casteamos a 'unknown' primero para evitar conflictos de tipos de Prisma
    return products as unknown as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Fetches a single product by its unique ID, including seller details.
 * @param id - The MongoDB ObjectId string.
 * @returns The product or null if not found.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: true,
      },
    });
    
    return product as unknown as Product | null;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}