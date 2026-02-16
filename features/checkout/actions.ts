'use server';

import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Interface representing the shipping address data.
 * Used for validation and type safety when processing the order.
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', // Use latest stable version or match your dashboard
});

/**
 * Creates a real Stripe Payment Intent.
 *
 * @remarks
 * 1. Verifies the user's session.
 * 2. Calculates the total amount from the database (Cart).
 * 3. Creates a PaymentIntent in Stripe.
 * 4. Returns the client_secret to the frontend.
 *
 * @returns A promise resolving to the client secret and payment intent ID.
 */
export async function createPaymentIntent(): Promise<{ clientSecret: string; id: string } | { error: string }> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: 'No autenticado' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!user || !user.cart || user.cart.items.length === 0) {
      return { error: 'Carrito vacío' };
    }

    // Calculate total on server side (critical security step)
    const totalAmount = user.cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Mock shipping logic (must match frontend)
    const shippingCost = totalAmount > 100 ? 0 : 15;
    const finalAmount = totalAmount + shippingCost;
    
    // Convert to cents for Stripe
    const amountInCents = Math.round(finalAmount * 100);

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd', // Change to 'mxn' if needed
      metadata: {
        userId: user.id,
        cartId: user.cart.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Error al generar client_secret de Stripe');
    }

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { error: 'Error al iniciar el pago con Stripe' };
  }
}

/**
 * Processes the final order after payment confirmation.
 *
 * @remarks
 * This function handles the post-payment logic:
 * 1. Verifies the user's session.
 * 2. Retrieves the user's cart.
 * 3. (Mock) Saves the order to the database.
 * 4. Clears the user's cart.
 * 5. Revalidates paths to update the UI.
 *
 * @param address - The shipping address provided by the user.
 * @returns A promise resolving to a success or error object.
 */
export async function processOrder(address: ShippingAddress) {
  try {
    const session = await auth();
    
    // 1. Authentication Check
    if (!session?.user?.email) {
      return { error: 'Debes iniciar sesión para procesar una orden' };
    }

    // 2. Get User and Cart
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!user || !user.cart || user.cart.items.length === 0) {
      return { error: 'El carrito está vacío o no se encontró el usuario' };
    }

    // 3. Save Order using a Transaction
    const total = user.cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Use interactive transaction to ensure data integrity
    const order = await prisma.$transaction(async (tx) => {
      // a. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          total: total,
          status: 'PENDING', // or 'PAID' if we assume payment is confirmed
          shippingName: `${address.firstName} ${address.lastName}`,
          shippingAddress: address.address,
          shippingCity: address.city,
          shippingPostal: address.postalCode,
          shippingCountry: address.country,
          paymentId: `pid_${Date.now()}`, // Store real Stripe ID here later
          items: {
             create: user.cart!.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price // Snapshot price!
             }))
          }
        },
      });

      // b. Clear the Cart
      await tx.cartItem.deleteMany({
        where: { cartId: user.cart!.id }
      });
      
      return newOrder;
    });

    console.log('✅ [ORDER PERSISTED]', {
      orderId: order.id,
      email: user.email,
      total,
    });

    // 5. Revalidate
    revalidatePath('/cart');
    revalidatePath('/'); // Update navbar badge

    return { success: true, orderId: order.id };

  } catch (error) {
    console.error('Error processing order:', error);
    return { error: 'Ocurrió un error al procesar la orden. Por favor intenta nuevamente.' };
  }
}
