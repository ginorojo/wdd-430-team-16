import { prisma } from "@/app/lib/prisma";
import type { Product } from "./types";

/**
 * Fetches all products from the database.
 * Orders them by creation date (newest first).
 * * @returns A list of products.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    // We don't need 'use server' here if called from Server Components
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Fetches a single product by its unique ID.
 * * @param id - The MongoDB ObjectId string.
 * @returns The product or null if not found.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}
