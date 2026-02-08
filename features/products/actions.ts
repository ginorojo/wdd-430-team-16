"use server"; // 👈 CRITICAL: Marks this as backend code callable from frontend

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductSchema } from "./schemas";
import type { ActionResponse, CreateProductInput } from "./types";
import fs from "fs/promises";
import path from "path";

/**
 * Creates a new product in the database.
 * * @param data - Raw input data (usually from a form).
 * @returns Standardized response object.
 */
export async function createProduct(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  // 1. Extract data including the file
  const file = formData.get("imageFile") as File;

  // Transform price to number for Zod
  const rawData = {
    title: formData.get("title"),
    price: parseFloat(formData.get("price") as string),
    category: formData.get("category"),
    description: formData.get("description"),
    sellerId: formData.get("sellerId"),
    image: "/placeholder.jpg", // We'll update this after saving the file
  };

  const result = ProductSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      message: "Error de validación",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // 2. Save the file to public/marketplace
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const publicPath = path.join(
      process.cwd(),
      "public",
      "marketplace",
      filename,
    );

    await fs.writeFile(publicPath, buffer);

    // 3. Database Insertion
    await prisma.product.create({
      data: {
        ...result.data,
        image: `/marketplace/${filename}`,
      },
    });

    revalidatePath("/sellers/dashboard");
    return { success: true, message: "Producto creado con éxito" };
  } catch (error) {
    return { success: false, message: "Error al guardar en base de datos" };
  }
}

/**
 * Deletes a product by ID.
 */
export async function deleteProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    
    if (product?.image && product.image.startsWith("/marketplace/")) {
      const filePath = path.join(process.cwd(), "public", product.image);
      await fs.unlink(filePath).catch(() => console.log("File already gone"));
    }

    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/sellers/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Error al eliminar" };
  }
}

/**
 * Updates a product by ID.
 */
export async function updateProduct(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const file = formData.get("imageFile") as File;
  
  const data: any = {
    title: formData.get("title"),
    price: parseFloat(formData.get("price") as string),
    category: formData.get("category"),
    description: formData.get("description"),
  };

  try {
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      await fs.writeFile(path.join(process.cwd(), "public/marketplace", filename), buffer);
      data.image = `/marketplace/${filename}`;
    }

    await prisma.product.update({ where: { id }, data });
    revalidatePath("/sellers/dashboard");
    return { success: true, message: "Actualizado correctamente" };
  } catch (error) {
    return { success: false, message: "Error al actualizar" };
  }
}
