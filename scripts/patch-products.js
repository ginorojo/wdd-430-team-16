const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const productDescriptions = {
    "Jarrón Terra Minimalista": "A hand-crafted ceramic vase with a warm terracotta finish. Perfect for minimalist interiors and dried floral arrangements. Each piece is uniquely textured by the artisan's hands.",
    "Vasija de Arcilla Blanca": "Elegant white clay vessel featuring a smooth, matte finish. This piece balances traditional pottery techniques with modern aesthetic sensibilities.",
    "Tabla de picar": "Heavy-duty cutting board made from sustainably sourced hardwood. Treated with food-safe oils to preserve the natural grain and ensure longevity in your kitchen.",
    "Banco de madera": "Sturdy yet stylish wooden bench crafted from solid oak. Ideal for entryways or as a minimalist seating option. Features clean lines and a durable finish.",
    "Manta Tejige": "Luxurious hand-woven throw blanket made from 100% organic cotton. Features a subtle geometric pattern and soft-touch texture for ultimate comfort.",
    "Manteles de Lino Crudo": "Set of premium raw linen napkins. Naturally durable and absorbent, these linens add a touch of rustic elegance to any dining experience.",
    "Collar Colgante Oro": "Exquisite gold-plated pendant necklace featuring a minimalist geometric design. Hand-polished to a high shine, it's the perfect statement piece for any occasion.",
    "Anillos Artesanales": "Unique hand-hammered silver ring set with a genuine turquoise stone. Each ring tells a story of craftsmanship and natural beauty."
};

async function patch() {
    console.log("🚀 Starting Product Description Patch...");

    try {
        const products = await prisma.product.findMany();
        console.log(`🔍 Found ${products.length} products to process.`);

        for (const product of products) {
            const description = productDescriptions[product.title] || "A unique hand-crafted piece from our artisanal collection. Made with passion and attention to detail.";

            await prisma.product.update({
                where: { id: product.id },
                data: { description }
            });

            console.log(`✅ Updated: ${product.title}`);
        }

        console.log("✨ Patch finished successfully!");
    } catch (error) {
        console.error("❌ Patch Error:", error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

patch();
