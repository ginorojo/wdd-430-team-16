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

/**
 * Mock response interface for a Payment Intent.
 * In a real Stripe integration, this would come from the Stripe SDK.
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
}

/**
 * Creates a mock Payment Intent for Stripe.
 *
 * @remarks
 * This function simulates the server-side creation of a Stripe PaymentIntent.
 * In a real application, you would:
 * 1. Calculate the total amount on the server (NEVER trust the client).
 * 2. Call `stripe.paymentIntents.create`.
 * 3. Return the `client_secret` to the frontend.
 *
 * @param amount - The total amount to charge (in cents).
 * @returns A promise resolving to a mock PaymentIntentResponse.
 */
export async function createPaymentIntent(amount: number): Promise<PaymentIntentResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`[Mock Stripe] Creating payment intent for amount: $${amount / 100}`);

  return {
    id: `pi_mock_${Math.random().toString(36).substring(7)}`,
    clientSecret: `sk_test_mock_secret_${Math.random().toString(36).substring(7)}`,
  };
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
