'use server';

import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

/**
 * Fetches the order history for the current authenticated user.
 */
export async function getUserOrders() {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Authentication required' };

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return { error: 'User not found' };

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { error: 'Error al obtener el historial de pedidos' };
  }
}
