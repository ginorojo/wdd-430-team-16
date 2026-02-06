'use client';

import { registerUser } from '@/features/auth/actions';
import { useActionState } from 'react';

export default function SignupForm() {
  const [state, dispatch] = useActionState(registerUser, undefined);

  // Mapeo seguro para TypeScript:
  // Forzamos un tipo plano para evitar el error de "Property does not exist on type... root"
  const errors = state?.error as {
    name?: string[];
    email?: string[];
    password?: string[];
    root?: string[];
  } | undefined;

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

      <form action={dispatch} className="space-y-4">
        {/* Campo Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            name="name" 
            type="text" 
            placeholder="Jane Doe"
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Campo Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            name="email" 
            type="email" 
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Campo Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            name="password" 
            type="password" 
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors?.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Error General (Root) */}
        {errors?.root && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
            {errors.root}
          </div>
        )}
        
        {/* Mensaje de Éxito */}
        {state?.success && (
          <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
            {state.success} <a href="/login" className="font-bold underline">Log in now</a>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
      </p>
    </div>
  );
}