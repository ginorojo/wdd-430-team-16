"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function MobileMenu({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#283618]">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#F7F3E7] border-b border-gray-200 p-6 flex flex-col gap-6 shadow-xl z-50">
          {children}
        </div>
      )}
    </div>
  );
}
