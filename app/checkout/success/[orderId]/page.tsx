import { getOrderById } from '@/features/checkout/actions';
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { notFound } from 'next/navigation';

interface SuccessPageProps {
    params: Promise<{ orderId: string }>;
}

/**
 * SuccessPage Component
 * 
 * Displays a summary of a successful order.
 * Designed with a Mobile-First approach and premium aesthetics.
 */
export default async function SuccessPage({ params }: SuccessPageProps) {
    const { orderId } = await params;
    const order = await getOrderById(orderId);

    if (!order) {
        notFound();
    }

    const date = new Date(order.createdAt).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">
                        ¡Pago confirmado!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Gracias por tu compra. Hemos recibido tu pedido y estamos trabajando en él.
                    </p>
                    <div className="mt-4 inline-block bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-500 shadow-sm">
                        ID de Orden: <span className="text-gray-900">{order.id}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Order Details */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" aria-labelledby="details-heading">
                        <div className="p-6 border-b border-gray-50">
                            <h2 id="details-heading" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                Resumen del pedido
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-4">
                                        {item.productImage && (
                                            <Image
                                                src={item.productImage}
                                                alt=""
                                                width={48}
                                                height={48}
                                                className="rounded-lg bg-gray-100 object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{item.productTitle}</p>
                                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span>{order.shippingCost === 0 ? 'Gratis' : `$${order.shippingCost.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Impuestos (IVA 15%)</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-50">
                                    <span>Total pagado</span>
                                    <span>${order.total.toFixed(2)} {order.currency.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Shipping and Payment Info */}
                    <div className="space-y-8">
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" aria-labelledby="shipping-heading">
                            <h2 id="shipping-heading" className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-primary" />
                                Detalles de envío
                            </h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{order.shippingName}</p>
                                <p>{order.shippingAddress}</p>
                                <p>{order.shippingCity}, {order.shippingPostal}</p>
                                <p>{order.shippingCountry}</p>
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" aria-labelledby="payment-heading">
                            <h2 id="payment-heading" className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Método de pago
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-gray-400">VISA</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">Tarjeta terminada en {order.paymentMethodLast4}</p>
                                    <p>Fecha: {date}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={"/orders" as any}
                        className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        Ver mis pedidos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href={"/artisans" as any}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </main>
    );
}
