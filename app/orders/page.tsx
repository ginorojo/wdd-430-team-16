import React from 'react';
import { getUserOrders } from '@/features/orders/actions';
import OrdersList from '@/app/ui/orders/OrdersList';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
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
export default async function OrdersPage() {
    const result = await getUserOrders();

    if ('error' in result) {
        // Redirigir al login si no está autenticado
        if (result.error === 'Authentication required') {
            redirect('/login?callbackUrl=/orders');
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
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700" id="main-content">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4 transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Regresar a la tienda
                        </Link>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            Mis Pedidos
                            <span className="text-lg font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                {orders.length}
                            </span>
                        </h1>
                    </div>
                </header>

                <div className="space-y-8">
                    <OrdersList orders={orders} />
                </div>
            </div>
        </main>
    );
}
