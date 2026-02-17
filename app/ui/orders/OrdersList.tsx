import React from 'react';
import { Package, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';

interface OrderItem {
    id: string;
    productTitle: string;
    productImage: string | null;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    createdAt: Date;
    total: number;
    status: string;
    items: OrderItem[];
}

interface OrdersListProps {
    orders: Order[];
}

/**
 * OrdersList Component
 * 
 * Displays a list of orders with snapshot details.
 * Optimized with a minimalist grid for desktop and elegant cards for mobile.
 */
export default function OrdersList({ orders }: OrdersListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-[#FDFBF7] rounded-[2.5rem] border border-[#EADDCA] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]">
                <div className="bg-[#EADDCA]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-[#BC6C25]/30" />
                </div>
                <h3 className="text-2xl font-bold text-[#283618] mb-2">Aún no tienes pedidos</h3>
                <p className="text-[#5C4033]/60 mb-8 max-w-xs mx-auto text-sm">
                    Explora nuestra tienda y descubre piezas artesanales únicas hechas para ti.
                </p>
                <Link
                    href={"/artisans" as any}
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#8D5F42] text-white font-bold rounded-full hover:bg-[#704a33] transition-all shadow-md shadow-primary/20 text-sm"
                >
                    Empezar a comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="list">
            {orders.map((order) => (
                <Link
                    key={order.id}
                    href={`/checkout/success/${order.id}` as any}
                    className="bg-[#FDFBF7] rounded-[2rem] border border-[#EADDCA]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group outline-none focus:ring-4 focus:ring-[#BC6C25]/10"
                    role="listitem"
                >
                    <div className="p-6 flex flex-col h-full">
                        {/* Status & ID Header */}
                        <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.status === 'PAID'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-[#BC6C25]/10 text-[#BC6C25] border-[#BC6C25]/20'
                                }`}>
                                {order.status === 'PAID' ? 'Entregado' : 'Pendiente'}
                            </span>
                            <span className="text-[10px] text-[#8D5F42]/40 font-mono font-bold">#{order.id.slice(-6).toUpperCase()}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar size={14} className="text-[#BC6C25]" />
                            <p className="text-xs font-bold text-[#283618]/70">
                                {new Date(order.createdAt).toLocaleDateString('es-MX', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Items Stack (More minimalist) */}
                        <div className="flex -space-x-3 mb-8">
                            {order.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="relative w-12 h-12 rounded-xl border-[3px] border-[#FDFBF7] overflow-hidden bg-white shadow-sm transition-transform group-hover:scale-105">
                                    {item.productImage ? (
                                        <Image src={item.productImage} alt="" fill sizes="48px" className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <Package size={16} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <div className="w-12 h-12 rounded-xl border-[3px] border-[#FDFBF7] bg-[#283618] flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                    +{order.items.length - 3}
                                </div>
                            )}
                        </div>

                        {/* Footer: Price and CTA */}
                        <div className="mt-auto pt-5 border-t border-[#EADDCA]/30 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] uppercase tracking-tighter font-black text-[#BC6C25]/60 mb-0.5">Total pagado</p>
                                <p className="text-lg font-black text-[#283618] tracking-tight">
                                    ${order.total.toFixed(2)}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#EADDCA]/20 flex items-center justify-center text-[#BC6C25] group-hover:bg-[#BC6C25] group-hover:text-white transition-all">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
