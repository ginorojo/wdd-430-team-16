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
        country: initialData?.country || 'México', // Default to probable user location
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
            const issues = result.error.issues || result.error.errors; // Fallback to be safe
            issues.forEach((err: any) => {
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

    /**
     * Helper to render an input field with standard styling and error handling.
     */
    const renderInput = (name: keyof ShippingAddress, label: string, placeholder?: string, type: string = 'text') => (
        <div className="col-span-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl border ${errors[name] ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'
                    } bg-white outline-none transition-all placeholder:text-gray-400`}
            />
            {errors[name] && (
                <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Dirección de Envío</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('firstName', 'Nombre', 'Juan')}
                    {renderInput('lastName', 'Apellido', 'Pérez')}

                    <div className="md:col-span-2">
                        {renderInput('address', 'Dirección', 'Calle Principal 123, Col. Centro')}
                    </div>

                    {renderInput('city', 'Ciudad', 'Ciudad de México')}
                    {renderInput('postalCode', 'Código Postal', '06000')}

                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            País
                        </label>
                        <select
                            name="country"
                            id="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-gray-700"
                        >
                            <option value="México">México</option>
                            <option value="Estados Unidos">Estados Unidos</option>
                            <option value="Canadá">Canadá</option>
                            <option value="Colombia">Colombia</option>
                            <option value="España">España</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg active:scale-95 transform duration-150"
                    >
                        Continuar al Pago
                    </button>
                </div>
            </div>
        </form>
    );
}
