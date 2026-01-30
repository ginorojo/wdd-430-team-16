import { z } from "zod";
import { ProductSchema } from "./schemas";
import type { Product as PrismaProduct } from "../../generated/prisma/client";
// 👆 Ajusta esta importación si tu generated está en otro lado

// Input type for creating a product (inferred from Zod)
export type CreateProductInput = z.infer<typeof ProductSchema>;

// Input type for updating a product
export type UpdateProductInput = Partial<CreateProductInput> & { id: string };

// The full Product type returned from Database
export type Product = PrismaProduct;

// Standardized API Response structure
export type ActionResponse<T = null> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};
