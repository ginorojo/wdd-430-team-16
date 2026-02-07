'use server';

import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string, quantity: number) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return { error: 'Debes iniciar sesión para agregar productos al carrito' };
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    });

    if (!user) {
      return { error: 'Usuario no encontrado' };
    }

    // Get or create cart
    let cart = user.cart;
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      });
    }

    revalidatePath('/cart');
    return { success: true, message: 'Producto agregado al carrito' };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { error: 'Error al agregar producto al carrito' };
  }
}

export async function getCart() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: true
          }
        }
      }
    });

    return user?.cart || null;
  } catch (error) {
    console.error('Error getting cart:', error);
    return null;
  }
}

export async function removeFromCart(formData: FormData) {
  'use server';
  try {
    const cartItemId = String(formData.get('cartItemId'));
    if (!cartItemId) {
      return { error: 'No se proporcionó cartItemId' };
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    // Revalidate cart and home so navbar badge updates
    revalidatePath('/cart');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error removing cart item:', error);
    return { error: 'Error al eliminar el artículo' };
  }
}

export async function updateCartItemQuantity(formData: FormData) {
  'use server';
  try {
    const cartItemId = String(formData.get('cartItemId'));
    const deltaRaw = formData.get('delta');
    const quantityRaw = formData.get('quantity');

    if (!cartItemId) return { error: 'cartItemId requerido' };

    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem) return { error: 'Artículo no encontrado' };

    let newQuantity = cartItem.quantity || 0;
    if (deltaRaw !== null) {
      const delta = Number(deltaRaw);
      newQuantity = Math.max(0, newQuantity + delta);
    } else if (quantityRaw !== null) {
      newQuantity = Math.max(0, Number(quantityRaw));
    }

    if (newQuantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity: newQuantity } });
    }

    revalidatePath('/cart');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return { error: 'Error al actualizar la cantidad' };
  }
}

export async function clearCart() {
  'use server';
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: 'No autenticado' };

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { cart: true } });
    if (!user || !user.cart) return { success: true };

    await prisma.cartItem.deleteMany({ where: { cartId: user.cart.id } });

    revalidatePath('/cart');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { error: 'Error al vaciar el carrito' };
  }
}
