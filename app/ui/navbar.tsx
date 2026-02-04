import React from "react";
import Link from "next/link";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { auth, signOut } from "@/auth"; // Importamos la sesión y la función de salida

/**
 * Global Navigation Component.
 *
 * Displays the branding, main navigation links, and user session controls.
 * It dynamically renders "Login" or "Logout" based on the authentication status.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export const Navbar = async () => {
  // 1. Fetch the user session on the server
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="bg-[#F7F3E7] flex items-center justify-between px-8 py-6 border-b border-gray-100 shadow-sm">
      {/* --- LOGO SECTION --- */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-sm">
          <img
            src="/images/logo.png"
            alt="Artisanal Refuge Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <Link href="/" className="font-bold text-xl tracking-tight text-[#c06941]">
          Artisanal
          <br /> Refuge
        </Link>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <div className="flex text-[#000] items-center gap-8 font-medium">
        <Link href="/explore" className="hover:text-[#BC6C25] transition-colors">
          Explore
        </Link>
        <Link href="/artisans" className="hover:text-[#BC6C25] transition-colors">
          Artisans
        </Link>
        <Link href="/about" className="hover:text-[#BC6C25] transition-colors">
          About us
        </Link>

        {/* --- DYNAMIC AUTH SECTION --- */}
        {user ? (
          // A) USER IS LOGGED IN
          <div className="flex items-center gap-4 border-l pl-6 border-gray-300">
            <div className="flex items-center gap-2 text-[#c06941]">
              <User size={20} />
              <span className="text-sm font-semibold truncate max-w-[100px]">
                {user.name?.split(" ")[0]} {/* Show only first name */}
              </span>
            </div>

            {/* Logout Server Action */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
                title="Sign Out"
              >
                Logout
                <LogOut size={18} />
              </button>
            </form>
          </div>
        ) : (
          // B) USER IS GUEST
          <Link
            href="/login"
            className="hover:text-[#BC6C25] font-semibold transition-colors"
          >
            Login
          </Link>
        )}

        {/* --- CART BUTTON --- */}
        <button className="relative p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ShoppingCart size={24} className="text-[#283618]" />
        </button>
      </div>
    </nav>
  );
};