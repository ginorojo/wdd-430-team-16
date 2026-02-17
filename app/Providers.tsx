/**
 * Global Client-Side Application Providers
 * 
 * This file centralizes all React context providers that must run on the client.
 * Using a separate 'Providers' file allows us to keep 'layout.tsx' as a 
 * Server Component while still providing context into the client tree.
 */
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {/* 
        SessionProvider: Enables access to the authentication session via 
        'useSession()' hooks in client components and facilitates 
        client-side session updates.
      */}
            {children}
        </SessionProvider>
    );
}
