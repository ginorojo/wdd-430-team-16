import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import CheckoutForm from '@/app/ui/checkout/CheckoutForm';
import OrderSummary from '@/app/ui/checkout/OrderSummary';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Metadata for the Checkout Page.
 */
export const metadata = {
    title: 'Checkout | Artesanías',
    description: 'Proceso de pago seguro para tus productos artesanales.',
};

/**
 * Checkout Page
 *
 * The main entry point for the checkout route.
 * Protected server component that checks authentication and loads the user's cart.
 * Renders the two-column layout: Form on the left, Summary on the right.
 */
export default async function CheckoutPage() {
    const session = await auth();

    // 1. Potect Route
    if (!session?.user?.email) {
        redirect('/api/auth/signin?callbackUrl=/checkout');
    }

    // 2. Fetch Data
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            cart: {
                include: {
                    items: {
                        include: { product: true }
                    }
                }
            }
        }
    });

    // 3. Handle Empty Cart
    if (!user || !user.cart || user.cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h1>
                    <p className="text-gray-600">Agrega productos antes de proceder al pago.</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    const items = user.cart.items;
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-[#F9F4EC]">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
                        Artesanías
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ShieldIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Checkout Seguro</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Link href="/cart" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                                <ArrowLeft className="w-4 h-4" />
                                Volver al carrito
                            </Link>
                        </div>

                        <CheckoutForm />
                    </div>

                    {/* Right Column: Summary (Sticky) */}
                    <div className="lg:col-span-5 relative">
                        <OrderSummary items={items} subtotal={subtotal} />
                    </div>
                </div>
            </main>
        </div>
    );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    );
}
