import type { NextAuthConfig } from "next-auth";

/**
 * NextAuth Configuration Object
 * 
 * This file contains the "Edge-compatible" configuration for NextAuth.js.
 * Since Middleware runs on the Edge Runtime, we define callbacks and routes 
 * here without importing database logic or heavy libraries.
 * 
 * Flow handled here:
 * 1. Authentication guard (Protected vs Public routes).
 * 2. Onboarding enforcement (Intercepting users without roles).
 * 3. Token/Session orchestration.
 */
export const authConfig = {
  /** 
   * Custom application pages mapping 
   */
  pages: {
    signIn: "/login",
  },
  
  callbacks: {
    /**
     * Authorized Callback:
     * 
     * This is the heart of the application's security. It runs before every request
     * to determine if the user has permission to view the target URL.
     * 
     * @param auth - Current session state (managed by NextAuth)
     * @param nextUrl - Details about the request URL
     * @returns Boolean to allow/deny, or a Redirect response
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const user = auth?.user;
      const onboardingCompleted = user?.onboardingCompleted;

      // --- 0. PUBLIC ROUTE WHITELIST (Performance & Safety) ---
      // These routes are static and public. We verify them first to avoid 
      // strict session checks or redirects clashing with rapid navigation.
      const publicWhitelist = ["/about", "/artisans", "/sellers"]; 
      if (publicWhitelist.some(path => nextUrl.pathname.startsWith(path))) {
        return true; 
      }

      // Diagnostic Log:
      if (isLoggedIn) {
        console.log(`[Middleware] User: ${user?.email} | Onboarding: ${onboardingCompleted} | Target: ${nextUrl.pathname}`);
      }

      // --- 1. ROUTE CLASSIFICATION ---
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");
      const isOnAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");
      
      /** Routes that require an authenticated session */
      const protectedRoutes = ['/dashboard', '/settings', "/sellers/dashboard"];
      const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));

      // --- 2. GLOBAL ONBOARDING ENFORCEMENT ---
      // Requirement: Users signed in via Social (Google) MUST pick a role before any other action.
      // Exception: Allow access to /about without onboarding to prevent redirect loops.
      if (isLoggedIn && !onboardingCompleted && !isOnOnboarding && !nextUrl.pathname.startsWith("/about")) {
        console.log(`[AuthGuard] Redirecting ${user?.email} to Onboarding`);
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      // --- 3. REDUNDANCY PROTECTION ---
      // If the user already picked a role, prevent them from going back to onboarding.
      if (isLoggedIn && onboardingCompleted && isOnOnboarding) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // --- 4. PROTECTED ROUTE LOGIC ---
      if (isProtectedRoute) {
        if (isLoggedIn) return true; // Access granted
        return false; // Triggers automatic redirect to /login
      }

      // --- 5. AUTH PAGE INTERCEPTION ---
      // If user is already authenticated, don't show the login/signup forms.
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // Default: Public access allowed (Home, Cart, About, etc.)
      return true;
    },
    
    /**
     * JWT Callback:
     * 
     * This method is called whenever a JSON Web Token is created or updated.
     * We use it to bake our custom database fields (role, onboardingCompleted)
     * into the encrypted client-side token for performance.
     * 
     * @param token - The current JWT token
     * @param user - Initial user data (only present on sign in)
     * @param trigger - The event that triggered this callback ('signIn', 'signUp', 'update')
     * @param session - Data passed from the client-side 'update()' method
     */
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Sign-In: Populate token with DB fields
      if (user) {
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }

      // 2. Client-Side Update: Sync changes from the UI ('update()' method)
      if (trigger === "update" && session) {
        if (session.role) token.role = session.role;
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
      }

      return token;
    },

    /**
     * Session Callback:
     * 
     * Transfers data from the persistent JWT token into the Session object
     * that is visible to 'useSession()' in the client and 'auth()' in the server.
     */
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  
  /** Providers are defined in the main auth.ts to keep this file Edge-compatible */
  providers: [], 
} satisfies NextAuthConfig;
