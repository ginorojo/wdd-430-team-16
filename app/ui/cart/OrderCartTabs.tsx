"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package } from "lucide-react";

/**
 * OrderCartTabs Component
 * 
 * Shared navigation tabs for switching between the Shopping Cart and Order History.
 * Designed with A11y and the brand's color palette in mind.
 */
const OrderCartTabs = () => {
    const pathname = usePathname();

    const tabs = [
        {
            id: "cart",
            label: "Mi Carrito",
            href: "/cart",
            icon: ShoppingCart,
            active: pathname === "/cart",
        },
        {
            id: "orders",
            label: "Mis Pedidos",
            href: "/orders",
            icon: Package,
            active: pathname === "/orders",
        },
    ];

    return (
        <nav
            className="flex items-center gap-2 bg-[#EADDCA]/30 p-1.5 rounded-2xl mb-8 w-fit mx-auto sm:mx-0 border border-[#BC6C25]/10 shadow-inner"
            aria-label="Menú de pedidos y carrito"
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.id}
                        href={tab.href as any}
                        className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 outline-none
              ${tab.active
                                ? "bg-white text-[#8D5F42] shadow-[0_4px_12px_-4px_rgba(141,95,66,0.3)] scale-[1.02]"
                                : "text-[#5C4033]/60 hover:text-[#8D5F42] hover:bg-white/40"
                            }
            `}
                        aria-current={tab.active ? "page" : undefined}
                    >
                        <Icon size={18} className={tab.active ? "text-[#8D5F42]" : "opacity-40"} />
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default OrderCartTabs;
