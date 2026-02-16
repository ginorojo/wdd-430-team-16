import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Repair Script: Data Consistency
 * 
 * Existing OrderItems in MongoDB may lack mandatory fields like 'productTitle'
 * causing Prisma to throw conversion errors. This script fills them with placeholders.
 */
async function repairOrders() {
    console.log('🛠️ Starting Data Repair...');

    try {
        // 1. Repair OrderItems
        const orderItems = await prisma.orderItem.findMany({
            include: { product: true }
        });

        console.log(`🔍 Found ${orderItems.length} order items to check.`);

        let itemRepairCount = 0;

        for (const item of orderItems) {
            if (!item.productTitle || !item.price) {
                console.log(`🔧 Repairing Item ${item.id}`);
                await prisma.orderItem.update({
                    where: { id: item.id },
                    data: {
                        productTitle: item.productTitle || item.product?.title || 'Producto sin título',
                        productImage: item.productImage || item.product?.image || null,
                        price: item.price || item.product?.price || 0,
                    }
                });
                itemRepairCount++;
            }
        }

        // 2. Repair Orders
        const orders = await prisma.order.findMany();
        console.log(`🔍 Found ${orders.length} orders to check.`);
        let orderRepairCount = 0;

        for (const order of orders) {
            if (!order.shippingName || !order.shippingAddress) {
                console.log(`🔧 Repairing Order ${order.id}`);
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        shippingName: order.shippingName || 'Usuario anterior',
                        shippingAddress: order.shippingAddress || 'N/A',
                        shippingCity: order.shippingCity || 'N/A',
                        shippingPostal: order.shippingPostal || '00000',
                        shippingCountry: order.shippingCountry || 'MX',
                    }
                });
                orderRepairCount++;
            }
        }

        console.log(`✅ Repair complete! Fixed ${itemRepairCount} items and ${orderRepairCount} orders.`);

    } catch (error) {
        console.error('❌ Error during repair:', error);
    } finally {
        await prisma.$disconnect();
    }
}

repairOrders();
