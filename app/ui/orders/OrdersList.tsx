import React from 'react';
import { Package, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
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
 * Optimized for mobile with a clean, card-based layout.
 */
export default function OrdersList({ orders }: OrdersListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes pedidos</h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    Explora nuestra tienda y descubre piezas artesanales únicas hechas para ti.
                </p>
                <Link
                    href="/artisans"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
                >
                    Empezar a comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6" role="list">
            {orders.map((order) => (
                <article
                    key={order.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group focus-within:ring-2 focus-within:ring-primary outline-none"
                    role="listitem"
                    aria-labelledby={`order-heading-${order.id}`}
                >
                    <div className="p-6">
                        {/* Header: Date and Order ID */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary" aria-hidden="true">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Fecha del pedido</p>
                                    <h3 id={`order-heading-${order.id}`} className="font-bold text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString('es-MX', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-1 sm:text-right">
                                <p className="text-xs text-gray-400 font-mono tracking-tighter">ID: {order.id}</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {order.status === 'PAID' ? 'Entregado' : 'Pendiente'}
                                </span>
                            </div>
                        </div>

                        {/* Items Preview */}
                        <div className="flex -space-x-4 mb-6 overflow-hidden">
                            {order.items.slice(0, 4).map((item) => (
                                <div key={item.id} className="relative w-16 h-16 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-sm">
                                    {item.productImage ? (
                                        <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-6 h-6 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {order.items.length > 4 && (
                                <div className="w-16 h-16 rounded-2xl border-4 border-white bg-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                    +{order.items.length - 4}
                                </div>
                            )}
                        </div>

                        {/* Summary and Link */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total pagado</p>
                                <p className="text-2xl font-black text-gray-900">
                                    ${order.total.toFixed(2)}
                                </p>
                            </div>
                            <Link
                                href={`/checkout/success/${order.id}`}
                                className="inline-flex items-center justify-center p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-primary hover:text-white transition-all group-hover:bg-primary group-hover:text-white"
                                aria-label={`Ver detalles del pedido ${order.id}`}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
