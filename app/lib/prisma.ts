// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Evita múltiples instancias de Prisma Client en desarrollo (Hot Reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;