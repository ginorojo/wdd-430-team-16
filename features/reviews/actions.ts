/*
 * features/reviews/actions.ts
 * - Creado en rama: feature/cart
 * - Server actions para crear reseñas de productos.
 */

'use server';

import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createReview(productId: string, rating: number, comment: string) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: 'Debes iniciar sesión para dejar una reseña' };
    }

    if (rating < 1 || rating > 5) {
      return { error: 'La calificación debe ser entre 1 y 5 estrellas' };
    }

    if (!comment.trim()) {
      return { error: 'El comentario no puede estar vacío' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: 'Usuario no encontrado' };
    }

    await prisma.review.create({
      data: {
        rating,
        comment: comment.trim(),
        productId,
        userId: user.id,
      },
    });

    revalidatePath(`/product/${productId}`);
    return { success: true, message: 'Reseña publicada exitosamente' };
  } catch (error) {
    console.error('Error creating review:', error);
    return { error: 'Error al publicar la reseña' };
  }
}
