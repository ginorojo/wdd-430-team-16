import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";
import { prisma } from "./app/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
/**
 * Main Authentication Entry Point.
 * Integrates the Prisma Adapter for MongoDB persistence and Google OAuth.
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: true, // <--- ⚠️ AGREGA ESTO AQUÍ
  ...authConfig, // Extend the Edge-compatible config

  // Connects NextAuth to our Prisma Client (MongoDB)
  // This automatically creates Users and Accounts in the DB on login
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // <--- ⚠️ AGREGA ESTO
      // Optional: Force prompt to select account every time
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorizes the user by verifying credentials against the database.
       */
      async authorize(credentials) {
        // 1. Validate input structure with Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // 2. Fetch user from DB
          const user = await prisma.user.findUnique({ where: { email } });

          // 3. Check if user exists and has a password (if they signed up via Google, they won't have one)
          if (!user || !user.password) return null;

          // 4. Verify password match
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
