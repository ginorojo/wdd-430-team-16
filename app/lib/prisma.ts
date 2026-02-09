// src/lib/prisma.ts
import "dotenv/config";
// 👇 IMPORTANTE: Ya no es '@prisma/client', es la ruta que definiste en el schema
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// import { PrismaClient } from "../../generated/prisma/client";

// // 1. Definimos una función que crea el cliente (igual que tu constructor antiguo)
// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     // Aquí puedes agregar logs si quieres ver las queries en consola como en Nest
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });
// };

// // 2. Guardamos el tipo en el objeto global de TypeScript
// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// // 3. Exportamos la instancia.
// // Si ya existe una (por el hot-reload), la reusamos. Si no, creamos una nueva.
// export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// // 4. En desarrollo, guardamos la referencia global para que no se pierda al recargar
// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }
