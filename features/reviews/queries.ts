/*
 * features/reviews/queries.ts
 * - Creado en rama: feature/cart
 * - Queries para obtener reseñas de un producto: las 5 más recientes y
 *   un resumen con promedio y distribución por estrellas.
 */

import { prisma } from '@/app/lib/prisma';

export interface ReviewWithUser {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface ReviewSummaryData {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>; // { 5: count, 4: count, ... }
}

/**
 * Obtiene las 5 reseñas más recientes de un producto.
 */
export async function getRecentReviews(productId: string): Promise<ReviewWithUser[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

/**
 * Obtiene el resumen de reseñas: promedio, total y distribución por estrellas.
 */
export async function getReviewSummary(productId: string): Promise<ReviewSummaryData> {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    let sum = 0;
    for (const r of reviews) {
      sum += r.rating;
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    }

    const averageRating = totalReviews > 0 ? sum / totalReviews : 0;

    return { averageRating, totalReviews, distribution };
  } catch (error) {
    console.error('Error fetching review summary:', error);
    return { averageRating: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }
}
