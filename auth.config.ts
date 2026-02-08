import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // Redirección si falla la auth
  },
  callbacks: {
    /**
     * Authorized Callback:
     * Controls access to routes based on authentication status.
     * This runs BEFORE the page renders (in the Middleware).
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // 1. Identify where the user is trying to go
      const protectedRoutes = ['/dashboard','/settings', "/sellers/dashboard"];
      
      // Verificamos si la ruta actual empieza con alguna de las protegidas
      const isProtectedRoute = protectedRoutes.some(route => 
        nextUrl.pathname.startsWith(route)
      );      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/signup");

      // 2. Logic for Protected Routes (Dashboard)
      if (isProtectedRoute) {
        if (isLoggedIn) return true; // Allowed
        return false; // Redirect unauthenticated users to Login
      }

      // 3. Logic for Auth Pages (Login/Signup)
      // If user is ALREADY logged in, don't let them see the login page again.
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // 4. Allow access to all other pages (Home, About, etc.)
      return true;
    },
  },
  providers: [], // Providers are in auth.ts
} satisfies NextAuthConfig;
