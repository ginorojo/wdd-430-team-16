'use client';

import React, { useState } from 'react';
import ShippingForm from './ShippingForm';
import StripePaymentForm from './StripePaymentForm';
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
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * Handles the submission of the shipping form.
     * Moves the user to the payment step and initializes the PaymentIntent.
     *
     * @param data - The validated shipping address.
     */
    const handleShippingSubmit = async (data: ShippingAddress) => {
        setShippingData(data);
        setLoading(true);

        try {
            // Init Stripe Payment Intent
            const result = await createPaymentIntent();
            if ('error' in result) {
                alert(result.error);
                return;
            }

            setClientSecret(result.clientSecret);
            setStep('payment');
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Error init payment:", error);
            alert("No se pudo iniciar el pago. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Callback for successful Stripe payment.
     * Now we just need to save the order in our DB and clear the cart.
     */
    const handlePaymentSuccess = async () => {
        if (!shippingData) return;

        setLoading(true);
        try {
            // Payment is already confirmed by Stripe at this point.
            // We process the order in our DB.
            const result = await processOrder(shippingData);

            if (result.success) {
                // Success! Redirect to home or a success page
                alert(`¡Orden procesada con éxito! ID: ${result.orderId}`);
                router.push('/');
            } else {
                alert(result.error || 'Error al guardar la orden');
            }

        } catch (error) {
            console.error(error);
            alert('Error inesperado al finalizar la orden.');
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
                <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
                    <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingData || {}} />
                    {loading && <p className="text-center mt-4 text-primary animate-pulse">Iniciando pago seguro...</p>}
                </div>
            )}

            {step === 'payment' && clientSecret && (
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

                    <StripePaymentForm
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                        onError={(msg) => alert(msg)}
                    />
                </div>
            )}
        </div>
    );
}
