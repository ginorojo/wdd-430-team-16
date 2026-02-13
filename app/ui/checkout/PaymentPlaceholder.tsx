import React from 'react';
import { ShieldCheck, CreditCard } from 'lucide-react';

/**
 * Props for PaymentPlaceholder component
 */
interface PaymentPlaceholderProps {
    /** Callback function to handle the "Pay" action */
    onPay: () => void;
    /** Boolean indicating if the payment is currently processing */
    loading: boolean;
}

/**
 * PaymentPlaceholder Component
 *
 * A visual placeholder for where the actual Stripe Payment Element would be rendered.
 * In a real integration, this would be replaced by `<PaymentElement />` from `@stripe/react-stripe-js`.
 *
 * @param onPay - Function to call when the user clicks "Pay".
 * @param loading - State to disable the button and show loading indicator.
 */
export default function PaymentPlaceholder({ onPay, loading }: PaymentPlaceholderProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Método de Pago
                </h3>

                {/* Mock Stripe Element Wrapper */}
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-2xl">💳</span>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-gray-900">Stripe Elements Placeholder</p>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Aquí se cargará el formulario de tarjeta seguro de Stripe.
                            (Simulación activa)
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Tus datos están encriptados y seguros.</span>
                </div>
            </div>

            <button
                onClick={onPay}
                disabled={loading}
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
                    'Pagar y Finalizar Orden'
                )}
            </button>
        </div>
    );
}
