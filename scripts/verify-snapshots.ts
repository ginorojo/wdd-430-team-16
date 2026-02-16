import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Verification Script: Database Snapshot Integrity
 * 
 * This script tests if changing a product's price or title 
 * affects existing orders (it shouldn't if snapshots are working).
 */
async function verifySnapshots() {
  console.log('🔍 Starting Snapshot Verification...');

  // 1. Find a recent order
  const latestOrder = await prisma.order.findFirst({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestOrder || latestOrder.items.length === 0) {
    console.error('❌ No orders found to verify.');
    return;
  }

  const firstItem = latestOrder.items[0];
  const originalPrice = firstItem.price;
  const originalTitle = firstItem.productTitle;

  console.log(`✅ Order ${latestOrder.id} snapshot: "${originalTitle}" at $${originalPrice}`);

  // 2. Temporarily modify the original product
  const product = await prisma.product.findUnique({
    where: { id: firstItem.productId },
  });

  if (!product) {
    console.error('❌ Original product not found or deleted.');
    return;
  }

  const newPrice = originalPrice + 100;
  const newTitle = `[MODIFIED] ${originalTitle}`;

  console.log(`🛠️ Temporarily changing product ${product.id} to: "${newTitle}" at $${newPrice}`);

  await prisma.product.update({
    where: { id: product.id },
    data: { price: newPrice, title: newTitle },
  });

  // 3. Re-verify the order item
  const verifiedOrder = await prisma.order.findUnique({
    where: { id: latestOrder.id },
    include: { items: true },
  });

  const verifiedItem = verifiedOrder!.items.find(i => i.id === firstItem.id);

  if (verifiedItem?.price === originalPrice && verifiedItem?.productTitle === originalTitle) {
    console.log('🎊 SUCCESS: The order snapshot remained IMMUTABLE! 🎊');
    console.log(`   Order still shows: "${verifiedItem.productTitle}" at $${verifiedItem.price}`);
  } else {
    console.error('⚠️ FAILURE: The order details CHANGED! Snapshots are not working correctly.');
  }

  // 4. Restore the product (Cleanup)
  console.log('🧹 Cleaning up: Restoring original product details...');
  await prisma.product.update({
    where: { id: product.id },
    data: { price: originalPrice, title: originalTitle },
  });

  await prisma.$disconnect();
}

verifySnapshots().catch(console.error);
