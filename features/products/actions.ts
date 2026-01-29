"use server"; // 👈 CRITICAL: Marks this as backend code callable from frontend

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductSchema } from "./schemas";
import type { ActionResponse, CreateProductInput } from "./types";

/**
 * Creates a new product in the database.
 * * @param data - Raw input data (usually from a form).
 * @returns Standardized response object.
 */
export async function createProduct(
  data: CreateProductInput,
): Promise<ActionResponse> {
  // 1. Validate Input with Zod
  const result = ProductSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // 2. Database Insertion
    await prisma.product.create({
      data: result.data,
    });

    // 3. Cache Invalidation (Updates the UI automatically)
    revalidatePath("/artisans"); // 👈 Change this to your products page route

    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("Create Error:", error);
    return { success: false, message: "Failed to create product in database" };
  }
}

/**
 * Deletes a product by ID.
 */
export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/artisans");
    return { success: true, message: "Product deleted" };
  } catch (error) {
    return { success: false, message: "Failed to delete product" };
  }
}
