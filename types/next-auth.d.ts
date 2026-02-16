import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Module augmentation for NextAuth types.
 * 
 * This allows us to extend the default Session and User interfaces
 * with our custom 'role' and 'onboardingCompleted' fields, ensuring 
 * full type safety across the application.
 */
declare module "next-auth" {
  /**
   * Extends the session.user object.
   */
  interface Session {
    user: {
      /** The user's application-wide role ('USER', 'SELLER', 'ADMIN') */
      role: string;
      /** Boolean flag indicating if the onboarding flow (role selection) is done */
      onboardingCompleted: boolean;
    } & DefaultSession["user"];
  }

  /**
   * Extends the user object returned by database adapters or standard login.
   */
  interface User {
    role: string;
    onboardingCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT token object used in middleware and server-side calls.
   */
  interface JWT {
    role: string;
    onboardingCompleted: boolean;
  }
}
