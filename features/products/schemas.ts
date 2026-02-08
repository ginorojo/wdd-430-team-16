import { z } from "zod";

/**
 * Base schema for Product validation.
 * Enforces business rules like positive prices and minimum text lengths.
 */
export const ProductSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),

  // Coerce converts "45" (string) to 45 (number) automatically if needed
  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than zero" }),

  description: z.string().optional(),

  sellerId: z.string().min(2, { message: "SellerId name is required" }),

  category: z.string().min(1, { message: "Please select a category" }),

  // Validates that the string is a valid URL
  image: z.string(),

  authorImage: z.string().url().optional().or(z.literal("")),
});

/**
 * Schema specifically for updating a product.
 * Makes the ID required to ensure we know what to update.
 */
export const UpdateProductSchema = ProductSchema.partial().extend({
  id: z.string().min(1),
});
