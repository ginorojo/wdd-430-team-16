import React from "react";
import Link from "next/link";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { auth, signOut } from "@/auth";
import { getCart } from "@/features/cart/actions";
import MobileMenu from "./MobileMenu";

export const Navbar = async () => {
  const session = await auth();
  const user = session?.user;
  const cart = await getCart();
  const itemCount =
    cart?.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0;

  // Reusable Navigation Links
  const NavLinks = () => (
    <>
      <Link
        href="/artisans"
        className="hover:text-[#BC6C25] text-[#283618] transition-colors py-2 lg:py-0"
      >
        Explore
      </Link>
      <Link
        href="/sellers"
        className="hover:text-[#BC6C25] text-[#283618] transition-colors py-2 lg:py-0"
      >
        Artisans
      </Link>
      <Link
        href="/about"
        className="hover:text-[#BC6C25] text-[#283618] transition-colors py-2 lg:py-0"
      >
        About us
      </Link>
    </>
  );

  return (
    <nav className="relative bg-[#F7F3E7] flex items-center justify-between px-4 sm:px-8 py-4 lg:py-6 border-b border-gray-100 shadow-sm">
      {/* --- LOGO SECTION --- */}
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl leading-tight tracking-tight text-[#c06941]"
        >
          Artisanal
          <br className="hidden sm:block" /> Refuge
        </Link>
      </div>

      {/* --- DESKTOP NAVIGATION --- */}
      <div className="hidden lg:flex items-center gap-8 font-medium text-[#000]">
        <NavLinks />

        {user ? (
          <div className="flex items-center gap-4 border-l pl-6 border-gray-300">
            <Link
              href="/sellers/dashboard"
              className="flex items-center gap-2 text-[#c06941]"
            >
              <User size={20} />
              <span className="text-sm font-semibold truncate max-w-[100px]">
                {user.name?.split(" ")[0]}
              </span>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 text-sm text-red-600 font-semibold"
              >
                Logout <LogOut size={18} />
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="hover:text-[#BC6C25] font-semibold transition-colors"
          >
            Login
          </Link>
        )}
      </div>

      {/* --- RIGHT SIDE: CART & MOBILE TOGGLE --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* CART (Always visible) */}
        <Link
          href="/cart"
          className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ShoppingCart size={24} className="text-[#283618]" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        {/* MOBILE MENU TOGGLE (Client Component) */}
        <MobileMenu user={user}>
          <div className="flex flex-col gap-4 font-medium">
            <NavLinks />
            <div className="border-t border-gray-200 pt-4 flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    href="/sellers/dashboard"
                    className="flex items-center gap-2 text-[#c06941] font-bold"
                  >
                    <User size={20} /> {user.name}
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-red-600 font-bold"
                    >
                      Logout <LogOut size={18} />
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-center py-3 bg-[#BC6C25] text-white rounded-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </MobileMenu>
      </div>
    </nav>
  );
};
