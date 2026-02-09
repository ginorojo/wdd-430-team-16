// src/lib/prisma.ts
import "dotenv/config";
// 👇 IMPORTANTE: Se ajusta la ruta al cliente generado, como indica el comentario en el seeder.
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
