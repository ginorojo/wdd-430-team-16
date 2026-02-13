'use client';

import React, { useState } from 'react';
import ShippingForm from './ShippingForm';
import PaymentPlaceholder from './PaymentPlaceholder';
import { ShippingAddress, processOrder, createPaymentIntent } from '@/features/checkout/actions';
import { useRouter } from 'next/navigation';

/**
 * Steps in the checkout process.
 */
type CheckoutStep = 'shipping' | 'payment';

/**
 * CheckoutForm Component
 *
 * The main orchestrator for the checkout process.
 * Manages the state between the Shipping and Payment steps.
 * Handles the communication with the server actions.
 */
export default function CheckoutForm() {
    const [step, setStep] = useState<CheckoutStep>('shipping');
    const [shippingData, setShippingData] = useState<ShippingAddress | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * Handles the submission of the shipping form.
     * Moves the user to the payment step.
     *
     * @param data - The validated shipping address.
     */
    const handleShippingSubmit = (data: ShippingAddress) => {
        setShippingData(data);
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Handles the final payment processing.
     * 1. Creates a payment intent (mock).
     * 2. Processes the order with the saved shipping data.
     * 3. Redirects the user on success.
     */
    const handlePayment = async () => {
        if (!shippingData) return;

        setLoading(true);
        try {
            // 1. Simulate Payment Intent Creation
            // In a real app, you'd fetch the total from the server or pass it securely
            const paymentIntent = await createPaymentIntent(5000); // Mock amount

            if (!paymentIntent.clientSecret) {
                throw new Error('Failed to init payment');
            }

            // 2. Process Order (this would usually happen after Stripe confirms payment via webhook or strict client confirmation)
            const result = await processOrder(shippingData);

            if (result.success) {
                // Success! Redirect to home or a success page
                alert(`¡Orden procesada con éxito! ID: ${result.orderId}`);
                router.push('/');
            } else {
                alert(result.error || 'Error al procesar la orden');
            }

        } catch (error) {
            console.error(error);
            alert('Error inesperado. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Steps Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
                <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-primary font-bold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'shipping' || step === 'payment' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                        1
                    </div>
                    <span>Envío</span>
                </div>
                <div className="w-16 h-[2px] bg-gray-200">
                    <div className={`h-full bg-primary transition-all duration-300 ${step === 'payment' ? 'w-full' : 'w-0'}`} />
                </div>
                <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-primary font-bold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'payment' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                        2
                    </div>
                    <span>Pago</span>
                </div>
            </div>

            {step === 'shipping' && (
                <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingData || {}} />
            )}

            {step === 'payment' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="mb-4">
                        <button
                            onClick={() => setStep('shipping')}
                            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
                        >
                            ← Volver a editar envío
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-sm text-gray-700">
                        <p className="font-bold mb-1">Enviando a:</p>
                        <p>{shippingData?.firstName} {shippingData?.lastName}</p>
                        <p>{shippingData?.address}</p>
                        <p>{shippingData?.city}, {shippingData?.postalCode}, {shippingData?.country}</p>
                    </div>

                    <PaymentPlaceholder onPay={handlePayment} loading={loading} />
                </div>
            )}
        </div>
    );
}
