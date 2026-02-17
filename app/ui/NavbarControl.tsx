"use client";

import { usePathname } from "next/navigation";
import React from "react";

/**
 * NavbarControl Component
 * 
 * A client-side logic wrapper for the Navbar.
 * It determines whether the navigation should be "Full" or "Minimal"
 * based on the current URL (e.g., hiding distractions on auth pages).
 */
export default function NavbarControl({
    children,
    onboardingCompleted,
    isLoggedIn
}: {
    children: React.ReactNode;
    onboardingCompleted: boolean;
    isLoggedIn: boolean;
}) {
    const pathname = usePathname();

    // Define pages where we want a minimal experience (just logo)
    const minimalPages = ["/login", "/signup", "/onboarding"];
    const isMinimal = minimalPages.includes(pathname);

    // If we are on an auth page, we only show the children (logo effectively stays outside)
    // but we can hide the rest. However, in the current Navbar layout, 
    // the logo is part of the same bar.

    if (isMinimal) {
        return null; // This will hide the middle and right sections
    }

    return <>{children}</>;
}
