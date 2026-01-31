import { prisma } from "@/app/lib/prisma";
import type { Seller } from "./types";

/**
 * Fetches all sellers from the database.
 * Orders them by creation date (newest first).
 * * @returns A list of sellers.
 */
export async function getSellers(): Promise<Seller[]> {
  try {
    // We don't need 'use server' here if called from Server Components
    const sellers = await prisma.seller.findMany({
      orderBy: { createdAt: "desc" },
    });
    return sellers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sellers");
  }
}

/**
 * Fetches best sellers from the database.
 * Orders them by creation date (newest first).
 * * @returns A list of best sellers.
 */
export async function getBestSellers(): Promise<Seller[]> {
  try {
    // We don't need 'use server' here if called from Server Components
    const sellers = await prisma.seller.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return sellers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sellers");
  }
}

/**
 * Fetches a single seller by its unique ID.
 * * @param id - The MongoDB ObjectId string.
 * @returns The seller or null if not found.
 */
export async function getSellerById(id: string): Promise<Seller | null> {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id },
    });
    return seller;
  } catch (error) {
    console.error(`Failed to fetch seller ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a single seller by its unique ID with the associated products.
 * * @param id - The MongoDB ObjectId string.
 * @returns The seller or null if not found.
 */
export async function getSellerWithProducts(id: string) {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: {
        products: true, // This pulls all products where sellerId matches
      },
    });
    return seller;
  } catch (error) {
    console.error(`Failed to fetch seller ${id}:`, error);
    return null;
  }
}
