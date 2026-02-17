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
    const [a11yMessage, setA11yMessage] = useState('');
    const router = useRouter();
    const titleRef = React.useRef<HTMLHeadingElement>(null);

    /**
     * Handles the submission of the shipping form.
     */
    const handleShippingSubmit = async (data: ShippingAddress) => {
        setShippingData(data);
        setLoading(true);

        try {
            const result = await createPaymentIntent();
            if ('error' in result) {
                alert(result.error);
                return;
            }

            setClientSecret(result.clientSecret);
            setStep('payment');
            setA11yMessage('Envío guardado. Ahora ingresa tus datos de pago.');

            // Focus management: Move focus to the top of the payment section
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                titleRef.current?.focus();
            }, 100);

        } catch (error) {
            console.error("Error init payment:", error);
            alert("No se pudo iniciar el pago. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Callback for successful Stripe payment.
     */
    const handlePaymentSuccess = async () => {
        if (!shippingData) return;

        setLoading(true);
        setA11yMessage('Pago confirmado por Stripe. Guardando tu orden...');

        try {
            const result = await processOrder(shippingData);

            if (result.success && result.orderId) {
                setA11yMessage('Orden guardada con éxito. Redirigiendo...');
                router.push(`/checkout/success/${result.orderId}` as any);
            } else {
                setLoading(false); // CRITICAL FIX: allow retry or show error
                setA11yMessage(`Error: ${result.error || 'No se pudo guardar la orden'}`);
                alert(result.error || 'Error al guardar la orden en la base de datos. Por favor, contacta a soporte.');
            }

        } catch (error) {
            console.error(error);
            setLoading(false);
            setA11yMessage('Error inesperado al procesar la orden.');
            alert('Error inesperado al finalizar la orden.');
        }
    };

    return (
        <div className="space-y-8">
            {/* Hidden accessibility announcer */}
            <div className="sr-only" role="status" aria-live="polite">
                {a11yMessage}
            </div>

            {/* Steps Indicator (Progress Bar) */}
            <nav aria-label="Progreso del checkout" className="mb-12">
                <div className="flex items-center justify-center space-x-4 max-w-sm mx-auto">
                    <div className={`flex flex-col items-center gap-2 ${step === 'shipping' ? 'text-primary font-bold' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step === 'shipping' || step === 'payment' ? 'border-primary bg-primary text-white' : 'border-gray-200'}`}>
                            1
                        </div>
                        <span className="text-xs uppercase tracking-wider">Envío</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 relative top-[-10px]">
                        <div className={`h-full bg-primary transition-all duration-500 ${step === 'payment' ? 'w-full' : 'w-0'}`} />
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${step === 'payment' ? 'text-primary font-bold' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step === 'payment' ? 'border-primary bg-primary text-white' : 'border-gray-200'}`}>
                            2
                        </div>
                        <span className="text-xs uppercase tracking-wider">Pago</span>
                    </div>
                </div>
            </nav>

            {step === 'shipping' && (
                <div
                    className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                    aria-busy={loading}
                >
                    <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingData || {}} />
                    {loading && (
                        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-primary font-bold animate-pulse">Iniciando pago seguro...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 'payment' && clientSecret && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="mb-6">
                        <button
                            onClick={() => setStep('shipping')}
                            className="text-sm text-gray-500 hover:text-primary flex items-center gap-2 py-2 px-1 transition-colors group"
                            aria-label="Volver a editar la información de envío"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            Volver a editar envío
                        </button>
                    </div>

                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8 text-sm shadow-sm">
                        <h3 ref={titleRef} tabIndex={-1} className="font-bold text-blue-900 mb-2 outline-none">
                            Enviando a:
                        </h3>
                        <p className="text-blue-800 leading-relaxed">
                            {shippingData?.firstName} {shippingData?.lastName}<br />
                            {shippingData?.address}<br />
                            {shippingData?.city}, {shippingData?.postalCode}, {shippingData?.country}
                        </p>
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
