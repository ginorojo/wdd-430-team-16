'use client';

import React from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

// Initialize Stripe loader outside component to avoid recreation
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentFormProps {
    clientSecret: string;
    onSuccess: () => void;
    onError: (msg: string) => void;
}

/**
 * Inner component that uses Stripe hooks.
 * Must be wrapped in <Elements>.
 */
function PaymentFormInner({ onSuccess, onError }: { onSuccess: () => void, onError: (msg: string) => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setMessage(null);

        // 1. Confirm Payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // Avoid redirect if not needed (e.g. for card payments)
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
        });

        if (error) {
            setMessage(error.message || 'Error desconocido');
            onError(error.message || 'Error desconocido');
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // 2. Payment Succeeded
            onSuccess();
        } else {
            setMessage('El pago no se pudo confirmar.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Tarjeta de Crédito / Débito
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        <Lock className="w-3 h-3" />
                        Encriptado SSL
                    </div>
                </div>

                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Pagos procesados de forma segura por Stripe.</span>
                </div>
            </div>

            {message && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                    </>
                ) : (
                    'Pagar Ahora'
                )}
            </button>
        </form>
    );
}

/**
 * StripePaymentForm wrapper
 * Loads the Elements context.
 */
export default function StripePaymentForm({ clientSecret, onSuccess, onError }: StripePaymentFormProps) {
    if (!clientSecret) return null;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <PaymentFormInner onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
}
