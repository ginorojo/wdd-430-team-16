import React from 'react';
import { getUserOrders } from '@/features/orders/actions';
import OrdersList from '@/app/ui/orders/OrdersList';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Mis Pedidos | Artisanal Refuge',
    description: 'Historial de tus compras únicas y artesanales',
};

/**
 * OrdersPage Component
 * 
 * Server-side page to show the list of orders for the current user.
 */
import OrderCartTabs from '@/app/ui/cart/OrderCartTabs';

export default async function OrdersPage() {
    const result = await getUserOrders();

    if ('error' in result) {
        if (result.error === 'Authentication required') {
            redirect('/login?callbackUrl=/orders' as any);
        }

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <p className="text-red-500 font-bold mb-4">{result.error}</p>
                <Link href="/" className="text-primary hover:underline">Volver al inicio</Link>
            </div>
        );
    }

    const orders = result.orders || [];

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
            <div className="max-w-4xl mx-auto">
                {/* TABS NAVIGATION */}
                <OrderCartTabs />

                <header className="mb-6">
                    {/* JSON-LD for Order History */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "ViewAction",
                                "name": "Ver Historial de Pedidos",
                                "target": "https://artisanal-refuge.vercel.app/orders"
                            }),
                        }}
                    />
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Mis Pedidos
                        </h1>
                        <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200">
                            {orders.length}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Revisa el estado y detalles de tus piezas adquiridas.</p>
                </header>

                <div className="space-y-8">
                    <OrdersList orders={orders} />
                </div>
            </div>
        </div>
    );
}
