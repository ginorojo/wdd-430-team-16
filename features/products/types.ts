import { z } from "zod";
import { ProductSchema } from "./schemas";
import type {
  Product as PrismaProduct,
  Seller as PrismaSeller,
} from "@prisma/client";

// Input types
export type CreateProductInput = z.infer<typeof ProductSchema>;
export type UpdateProductInput = Partial<CreateProductInput> & { id: string };

/**
 * 1. Definimos el tipo Seller basado en Prisma
 */
export type Seller = PrismaSeller;

/**
 * 2. Extendemos el tipo Product para que incluya la relación.
 * Esto es lo que permitirá que 'data.seller.name' sea válido.
 */
export type Product = PrismaProduct & {
  seller?: Seller; // Es opcional porque solo existe si usas 'include'
};

// Standardized API Response structure
export type ActionResponse<T = null> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};
