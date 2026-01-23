import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="bg-[#F7F3E7] flex items-center justify-between px-8 py-6 border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-sm">
          <img
            src="/images/logo.png"
            alt="Artisanal Refuge Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <span className="font-bold text-xl tracking-tight text-[#c06941]">
          Artisanal
          <br /> Refuge
        </span>
      </div>

      <div className="flex text-[#000] items-center gap-8 font-medium">
        <Link href="/explore" className="hover:text-[#BC6C25]">
          Explore
        </Link>
        <Link href="/artisans" className="hover:text-[#BC6C25]">
          Artisans
        </Link>
        <Link href="/about" className="hover:text-[#BC6C25]">
          About us
        </Link>
        <Link href="/login" className="hover:text-[#BC6C25]">
          Login
        </Link>
        <button className="relative p-1">
          <ShoppingCart size={24} className="text-[#283618]" />
        </button>
      </div>
    </nav>
  );
};
