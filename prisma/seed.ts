// prisma/seed.ts
import "dotenv/config";
// 👇 Aquí también cambiamos la ruta
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();
const initialProducts = [
  {
    title: "Jarrón Terra Minimalista",
    price: 45.0,
    author: "Aleiana Cormeltin",
    category: "Cerámica",
    // Jarrón de cerámica tonos tierra
    image: "/marketplace/adorno.png",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Vasija de Arcilla Blanca",
    price: 35.0,
    author: "Matura Gomel",
    category: "Cerámica",
    // Cerámica blanca texturizada
    image: "/marketplace/tazas.png ",
    authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
  },

  // --- MADERA (Woodworking) ---
  {
    
    title: "tabla de picar",
    price: 25.0,
    author: "Elsho Sandra",
    category: "Madera",
    // Cucharas de madera rústica
    image: "/marketplace/tabla.png",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    
    title: "Banco de madera",
    price: 40.0,
    author: "Davio Rossi",
    category: "Madera",
    // Cuencos apilados de madera
    image: "/marketplace/banco.png",
    authorImage: "https://randomuser.me/api/portraits/men/45.jpg",
  },

  // --- TEXTILES (Textiles) ---
  {
    
    title: "Manta Tejige",
    price: 80.0,
    author: "Sara Jenkins",
    category: "Textiles",
    // Manta de lana doblada
    image: "/marketplace/manta2.png",
    authorImage: "https://randomuser.me/api/portraits/women/90.jpg",
  },
  {
    
    title: "Manteles de Lino Crudo",
    price: 30.0,
    author: "Ana Silva",
    category: "Textiles",
    // Telas naturales
    image: "/marketplace/manta.png",
    authorImage: "https://randomuser.me/api/portraits/women/22.jpg",
  },

  // --- JOYERÍA (Jewelry) ---
  {
    
    title: "Collar Colgante Oro",
    price: 110.0,
    author: "Elena Joyas",
    category: "Joyería",
    // Joyería dorada minimalista
    image: "/marketplace/collar.png",
    authorImage: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    
    title: "Anillos Artesanales",
    price: 65.0,
    author: "Marco Polo",
    category: "Joyería",
    // Anillos sobre tela
    image: "/marketplace/anillo.png",
    authorImage: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  // ... añade aquí el resto de tus objetos
];

/**
 * Main function to seed the database with initial products.
 */
async function main() {
  console.log("Starting seed...");

  // Optional: Clear existing products to avolicates during testing
  await prisma.product.deleteMany();

  for (const product of initialProducts) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
