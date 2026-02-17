/**
 * @file navbar.tsx
 * @description Main navigation component. Handles user authentication state, 
 * cart count, and role-based navigation links.
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, LogOut, User, LayoutDashboard, ShoppingBag } from "lucide-react";
import { auth, signOut } from "@/auth";
import { getCart } from "@/features/cart/actions";
import MobileMenu from "./MobileMenu";
import NavbarControl from "./NavbarControl";

/**
 * Reusable Navigation Links component
 */
const NavLinks = () => (
  <>
    <Link
      href={"/artisans" as any}
      className="hover:text-[#BC6C25] text-foreground transition-colors py-2 lg:py-0"
    >
      Explore
    </Link>
    <Link
      href={"/sellers" as any}
      className="hover:text-[#BC6C25] text-foreground transition-colors py-2 lg:py-0"
    >
      Artisans
    </Link>
    <Link
      href={"/about" as any}
      className="hover:text-[#BC6C25] text-foreground transition-colors py-2 lg:py-0"
    >
      About us
    </Link>
  </>
);

export const Navbar = async () => {
  const session = await auth();
  const user = session?.user;
  const cart = await getCart();

  const itemCount = cart?.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0;

  // Logic for the profile link based on user role
  const getProfileHref = () => {
    if (!user) return "/login";
    if (user.role === "SELLER") return "/sellers/dashboard";
    if (user.role === "ADMIN") return "/dashboard";
    return "/orders"; // Default for customers
  };

  const profileHref = getProfileHref();

  return (
    <nav className="relative bg-[#F7F3E7] flex items-center justify-between px-4 sm:px-8 py-4 lg:py-6 border-b border-gray-100 shadow-sm" aria-label="Navegación principal">
      {/* --- LOGO SECTION --- */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Image
          src="/images/logo.webp"
          alt="Artisanal Refuge Logo"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl leading-tight tracking-tight text-[#a0522e]"
          aria-label="Artisanal Refuge - Ir al inicio"
        >
          Artisanal
          <br className="hidden sm:block" /> Refuge
        </Link>
      </div>

      {/* --- NAVIGATION & USER ACTIONS --- */}
      <NavbarControl
        onboardingCompleted={user?.onboardingCompleted ?? false}
        isLoggedIn={!!user}
      >
        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center gap-8 font-semibold text-[#3a432e]">
          <NavLinks />

          {user ? (
            <div className="flex items-center gap-4 border-l pl-6 border-gray-300">
              {/* Profile/Dashboard Link (Role-aware) */}
              {user.onboardingCompleted && (
                <Link
                  href={profileHref as any}
                  className="group relative flex items-center gap-3 pl-1.5 pr-5 py-1.5 rounded-full bg-[#fdfaf3] hover:bg-white transition-all duration-500 shadow-[0_2px_10px_-3px_rgba(141,95,66,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(141,95,66,0.15)] border border-[#DDA15E]/20"
                  aria-label="Mi cuenta y panel de control"
                >
                  {/* Avatar Icon / Image */}
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm transition-transform duration-500 group-hover:scale-105">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Usuario"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-[#8D5F42] to-[#BC6C25] flex items-center justify-center">
                        <User size={18} className="text-[#F7F3E7]" />
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                  </div>

                  {/* Identity Details */}
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#BC6C25] font-black leading-none mb-0.5">
                      {user.role === "SELLER" ? "Artisan" : user.role === "ADMIN" ? "Admin" : "Customer"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#283618] leading-none">
                        {user.name?.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Logout Button */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm text-red-700 font-bold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  Logout <LogOut size={18} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={"/login" as any}
              className="hover:text-[#BC6C25] font-semibold transition-colors px-4 py-2 bg-white rounded-lg border border-[#DDA15E]/20 text-sm"
            >
              Log in
            </Link>
          )}
        </div>

        {/* --- RIGHT SIDE: CART & MOBILE TOGGLE --- */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* CART (Visible for Logged In Customers) */}
          {user && user.role !== "ADMIN" && (
            <Link
              href={"/cart" as any}
              className="relative p-2 hover:bg-black/5 rounded-full transition-colors group"
              aria-label={`Carrito de compras, ${itemCount} productos`}
            >
              <ShoppingCart size={24} className="text-[#8D5F42] group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#BC6C25] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {/* MOBILE MENU TOGGLE */}
          <MobileMenu user={user}>
            <div className="flex flex-col gap-4 font-medium">
              <NavLinks />
              <div className="border-t border-gray-200 pt-4 flex flex-col gap-4">
                {user ? (
                  <>
                    {user.onboardingCompleted && (
                      <Link
                        href={profileHref as any}
                        className="flex items-center gap-3 text-[#BC6C25] font-bold p-2 bg-[#fdfaf3] rounded-lg"
                      >
                        {user.role === "SELLER" ? <LayoutDashboard size={20} /> : <ShoppingBag size={20} />}
                        {user.role === "SELLER" ? "Dashboard" : "Mis Pedidos"}
                      </Link>
                    )}
                    <form
                      action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                      }}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-2 text-red-700 font-bold w-full text-left p-2 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut size={20} /> Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href={"/login" as any}
                    className="text-center py-3 bg-[#BC6C25] text-white rounded-lg font-bold shadow-md active:scale-95 transition-transform"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </MobileMenu>
        </div>
      </NavbarControl>
    </nav>
  );
};
