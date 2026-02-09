// prisma/seed.ts
import "dotenv/config";
// 👇 Cambia la importación para usar el paquete estándar
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const initialProducts = [
  {
    title: "Jarrón Terra Minimalista",
    price: 45.0,
    category: "Cerámica",
    image: "/marketplace/adorno.png",
  },
  {
    title: "Vasija de Arcilla Blanca",
    price: 35.0,
    category: "Cerámica",
    image: "/marketplace/tazas.png",
  },
  {
    title: "Tabla de picar",
    price: 25.0,
    category: "Madera",
    image: "/marketplace/tabla.png",
  },
  {
    title: "Banco de madera",
    price: 40.0,
    category: "Madera",
    image: "/marketplace/banco.png",
  },
  {
    title: "Manta Tejige",
    price: 80.0,
    category: "Textiles",
    image: "/marketplace/manta2.png",
  },
  {
    title: "Manteles de Lino Crudo",
    price: 30.0,
    category: "Textiles",
    image: "/marketplace/manta.png",
  },
  {
    title: "Collar Colgante Oro",
    price: 110.0,
    category: "Joyería",
    image: "/marketplace/collar.png",
  },
  {
    title: "Anillos Artesanales",
    price: 65.0,
    category: "Joyería",
    image: "/marketplace/anillo.png",
  },
];

const initialSellers = [
  {
    name: "Alejandra Carmelín",
    bio: "Especialista en cerámica artesanal con técnicas ancestrales de horneado.",
    profileImage: "/images/alejandra_profile.png",
    heroBanner: "/images/alejandra_hero.jpg",
    category: "Cerámica",
    email: "alejandra@example.com",
  },
  {
    name: "Carlos Ruiz",
    bio: "Maestro ebanista dedicado a la creación de muebles sostenibles y funcionales.",
    profileImage: "/images/carlos_profile.png",
    heroBanner: "/images/carlos_hero.jpg",
    category: "Madera",
    email: "carlos@example.com",
  },
  {
    name: "Maria Silva",
    bio: "Diseñadora textil enfocada en el teñido natural y tejidos de lino orgánico.",
    profileImage: "/images/maria_profile.png",
    heroBanner: "/images/maria_hero.jpg",
    category: "Textiles",
    email: "maria@example.com",
  },
  {
    name: "Elena Joyas",
    bio: "Orfebre minimalista que trabaja con metales reciclados y piedras locales.",
    profileImage: "/images/elena_profile.png",
    heroBanner: "/images/elena_hero.jpg",
    category: "Joyería",
    email: "elena@example.com",
  },
  {
    name: "Mateo Gómez",
    bio: "Explorando la intersección entre el diseño moderno y la alfarería clásica.",
    profileImage: "/images/mateo_profile.png",
    heroBanner: "/images/mateo_hero.jpg",
    category: "Cerámica",
    email: "mateo@example.com",
  },
  {
    name: "Alita Guerrera",
    bio: "Diseñadora textil que combina técnicas tradicionales con estilos contemporáneos.",
    profileImage: "/images/alita_profile.png",
    heroBanner: "/images/alita_hero.jpg",
    category: "Textiles",
    email: "alita@example.com",
  },
];

/**
 * Main function to seed the database with initial products.
 */
async function main() {
  console.log("🚀 Starting database seed...");

  // 1. Clean existing data
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();
  console.log("🧹 Cleaned existing data.");

  // 2. Create Sellers and store them in an array to use their IDs
  const createdSellers = [];
  for (const s of initialSellers) {
    const seller = await prisma.seller.create({ data: s });
    createdSellers.push(seller);
  }
  console.log(`👤 Created ${createdSellers.length} sellers.`);

  // 3. Create Products and assign a random seller from the same category
  for (const p of initialProducts) {
    // Filter created sellers that match the product's category
    const matchingSellers = createdSellers.filter(
      (s) => s.category === p.category,
    );

    // Pick a random seller from the matching list
    const assignedSeller =
      matchingSellers[Math.floor(Math.random() * matchingSellers.length)];

    if (assignedSeller) {
      await prisma.product.create({
        data: {
          title: p.title,
          price: p.price,
          category: p.category,
          image: p.image,
          sellerId: assignedSeller.id, // Mandatory relational ID
        },
      });
    }
  }

  console.log("✨ Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
