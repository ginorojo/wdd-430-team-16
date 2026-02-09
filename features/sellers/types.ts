import { z } from "zod";
import { SellerSchema } from "./schemas";
// Change the import to point to the standard package
import type { Seller as PrismaSeller } from "@prisma/client";

// Input type for creating a seller (inferred from Zod)
// ...

// 👆 Ajusta esta importación si tu generated está en otro lado

// Input type for creating a seller (inferred from Zod)
export type CreateSellerInput = z.infer<typeof SellerSchema>;

// Input type for updating a seller
export type UpdateSellerInput = Partial<CreateSellerInput> & { id: string };

// The full Seller type returned from Database
export type Seller = PrismaSeller;

// Standardized API Response structure
export type ActionResponse<T = null> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};
