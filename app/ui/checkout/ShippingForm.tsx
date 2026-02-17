import React, { useState } from 'react';
import { ShippingAddress } from '@/features/checkout/actions';
import { z } from 'zod';

/**
 * Zod schema for validating shipping address.
 * Ensures all required fields are present and meet length requirements.
 */
const shippingSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    address: z.string().min(5, 'La dirección es muy corta'),
    city: z.string().min(2, 'Ciudad requerida'),
    postalCode: z.string().min(4, 'Código postal inválido'),
    country: z.string().min(2, 'País requerido'),
});

/**
 * Props for ShippingForm component
 */
interface ShippingFormProps {
    /** Callback function to submit valid address data to the parent component */
    onSubmit: (data: ShippingAddress) => void;
    /** Optional initial data to populate the form */
    initialData?: Partial<ShippingAddress>;
}

/**
 * ShippingForm Component
 *
 * Collects and validates the user's shipping address.
 * Uses Zod for client-side validation before invoking the onSubmit callback.
 *
 * @param onSubmit - Handler for successful form submission.
 * @param initialData - Optional default values.
 */
export default function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
    const [formData, setFormData] = useState<ShippingAddress>({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        postalCode: initialData?.postalCode || '',
        country: initialData?.country || 'USA', // Default to probable user location
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user types
        if (errors[name as keyof ShippingAddress]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate with Zod
        const result = shippingSchema.safeParse(formData);

        if (!result.success) {
            // Map Zod errors to state
            const newErrors: Record<string, string> = {};
            const issues = result.error.issues;
            issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(newErrors);
            return;
        }

        // Pass valid data to parent
        onSubmit(result.data);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
            aria-labelledby="shipping-form-title"
        >
            <h2 id="shipping-form-title" className="text-2xl font-bold text-gray-900 mb-8 sm:text-3xl">
                ¿A dónde enviamos tu pedido?
            </h2>

            <fieldset className="space-y-4 border-none p-0 m-0">
                <legend className="sr-only">Información de contacto y envío</legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                            Nombre
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            aria-invalid={!!errors.firstName}
                            aria-describedby={errors.firstName ? "firstName-error" : undefined}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500 focus:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-all bg-white text-gray-900 group`}
                            placeholder="Ej. Juan"
                            required
                        />
                        {errors.firstName && (
                            <p id="firstName-error" role="alert" className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                                <span aria-hidden="true">⚠️</span> {errors.firstName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                            Apellido
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            aria-invalid={!!errors.lastName}
                            aria-describedby={errors.lastName ? "lastName-error" : undefined}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500 focus:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-all bg-white text-gray-900`}
                            placeholder="Ej. Pérez"
                            required
                        />
                        {errors.lastName && (
                            <p id="lastName-error" role="alert" className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                                <span aria-hidden="true">⚠️</span> {errors.lastName}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                        Dirección completa
                    </label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        aria-invalid={!!errors.address}
                        aria-describedby={errors.address ? "address-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500 focus:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-all bg-white text-gray-900`}
                        placeholder="Calle, número, colonia..."
                        required
                    />
                    {errors.address && (
                        <p id="address-error" role="alert" className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                            <span aria-hidden="true">⚠️</span> {errors.address}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-2">
                        <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                            Ciudad
                        </label>
                        <input
                            id="city"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            aria-invalid={!!errors.city}
                            aria-describedby={errors.city ? "city-error" : undefined}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500 focus:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-all bg-white text-gray-900`}
                            required
                        />
                        {errors.city && <p id="city-error" role="alert" className="text-red-600 text-xs font-medium mt-1">{errors.city}</p>}
                    </div>

                    <div className="col-span-1 space-y-2">
                        <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700">
                            C.P.
                        </label>
                        <input
                            id="postalCode"
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            aria-invalid={!!errors.postalCode}
                            aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.postalCode ? 'border-red-500 focus:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-all bg-white text-gray-900`}
                            required
                        />
                        {errors.postalCode && <p id="postalCode-error" role="alert" className="text-red-600 text-xs font-medium mt-1">{errors.postalCode}</p>}
                    </div>

                    <div className="col-span-2 sm:col-span-1 space-y-2">
                        <label htmlFor="country" className="block text-sm font-semibold text-gray-700">
                            País
                        </label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white text-gray-900 shadow-sm"
                            aria-required="true"
                        >
                            <option value="USA">USA</option>
                            <option value="México">México</option>
                            <option value="Canadá">Canadá</option>
                            <option value="España">España</option>
                        </select>
                    </div>
                </div>
            </fieldset>

            <button
                type="submit"
                className="w-full mt-8 bg-primary hover:bg-opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-[0.98] shadow-lg hover:shadow-xl sm:text-lg flex items-center justify-center gap-2 group"
                aria-label="Continuar al paso de pago"
            >
                Continuar al pago
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
        </form>
    );
}
