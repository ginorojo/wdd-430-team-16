import React from 'react';
import Image from 'next/image';

/**
 * Interface for the props of the OrderSummary component.
 */
interface OrderSummaryProps {
    /** The list of items in the cart, including product details */
    items: any[]; // Using any to match the loose typing from the cart page for now, but should ideally be typed
    /** The calculated subtotal of the cart */
    subtotal: number;
}

/**
 * OrderSummary Component
 *
 * Displays a summary of the items in the cart, the subtotal, estimated shipping, and the total.
 * Designed to be used as a sticky sidebar in the checkout flow.
 *
 * @param items - The cart items to display.
 * @param subtotal - The current subtotal cost.
 */
export default function OrderSummary({ items, subtotal }: OrderSummaryProps) {
    // Mock shipping cost logic
    const shippingCost = subtotal > 100 ? 0 : 15;
    const total = subtotal + shippingCost;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Resumen de tu Orden</h2>

            {/* List of items */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                            {item.product?.image ? (
                                <Image
                                    src={item.product.image}
                                    alt={item.product.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200" />
                            )}
                            <span className="absolute bottom-0 right-0 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
                                x{item.quantity}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.product?.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                ${item.product?.price}
                            </p>
                        </div>

                        <div className="text-sm font-medium text-gray-900">
                            ${(item.product?.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary">
                        ${total.toFixed(2)}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">
                    Incluye impuestos aplicables
                </p>
            </div>
        </div>
    );
}
