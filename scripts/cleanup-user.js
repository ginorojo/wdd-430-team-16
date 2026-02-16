const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Cleanup Script: Deletes specific test users and ALL related data to bypass foreign key constraints.
 * 
 * Target: davidxsteven@gmail.com
 */
async function cleanup() {
    const email = "davidxsteven@gmail.com";

    console.log(`[Cleanup] Deep cleaning for: ${email}`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("[Cleanup] User not found. Nothing to delete.");
            return;
        }

        const userId = user.id;

        // 1. Delete Orders and Reviews (Relations that block deletion)
        await prisma.review.deleteMany({ where: { userId } });
        await prisma.order.deleteMany({ where: { userId } });
        await prisma.cart.deleteMany({ where: { userId } });
        await prisma.account.deleteMany({ where: { userId } });
        await prisma.session.deleteMany({ where: { userId } });

        // 2. Delete Seller profile
        await prisma.seller.deleteMany({ where: { email } });

        // 3. Final: Delete the User
        await prisma.user.delete({ where: { id: userId } });

        console.log("[Cleanup] Deep cleanup completed successfully.");
    } catch (error) {
        console.error("[Cleanup] Error:", error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

cleanup();
