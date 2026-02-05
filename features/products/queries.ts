import { prisma } from "@/app/lib/prisma";
import type { Product } from "./types";

interface ProductFilters {
  category?: string;
  material?: string;
  maxPrice?: number;
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        // Filtros dinámicos para MongoDB
        ...(filters?.category && { category: filters.category }),
        ...(filters?.material && { material: filters.material }),
        ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        seller: true, // Trae el nombre y foto del artesano
      },
    });

    return products as unknown as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { seller: true },
    });
    return product as unknown as Product | null;
  } catch (error) {
    console.error(`Error:`, error);
    return null;
  }
}