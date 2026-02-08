"use client";

import { useState, useActionState, useEffect, useTransition } from "react"; // Add useTransition
import { createProduct } from "@/features/products/actions";
import { Plus, X, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function AddProductModal({ sellerId }: { sellerId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 1. Hook for tracking manual transitions
  const [isPending, startTransition] = useTransition();

  // 2. useActionState stays for state management
  const [state, formAction] = useActionState(createProduct, null);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      setImageFile(null); // Reset file on success
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create FormData from the form
    const formData = new FormData(e.currentTarget);

    // Manually append the image file from our state
    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else {
      alert("Por favor sube una imagen.");
      return;
    }

    // 3. Wrap the call in startTransition to fix the error
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#BC6C25] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a05b1f] transition-all shadow-md"
      >
        <Plus size={20} /> Añadir Producto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-[#FEFAE0] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#DDA15E]/30">
            {/* Header */}
            <div className="bg-[#606C38] p-4 sm:p-6 flex justify-between items-center text-[#FEFAE0] shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Nuevo Producto
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:rotate-90 transition-transform shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-8 space-y-4 overflow-y-auto"
            >
              <input type="hidden" name="sellerId" value={sellerId} />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#283618] mb-1">
                    Título
                  </label>
                  <input
                    name="title"
                    required
                    placeholder="Nombre del producto"
                    className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none focus:ring-2 focus:ring-[#BC6C25]"
                  />
                  {state?.errors?.title && (
                    <p className="text-red-600 text-[10px] mt-1">
                      {state.errors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#283618] mb-1">
                      Precio ($)
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none focus:ring-2 focus:ring-[#BC6C25]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#283618] mb-1">
                      Categoría
                    </label>
                    <select
                      name="category"
                      className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none focus:ring-2 focus:ring-[#BC6C25]"
                    >
                      <option value="Cerámica">Cerámica</option>
                      <option value="Madera">Madera</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Joyería">Joyería</option>
                    </select>
                  </div>
                </div>

                <ImageUpload onImageProcessed={(file) => setImageFile(file)} />

                <div>
                  <label className="block text-sm font-bold text-[#283618] mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons: Stacks on mobile, Side-by-side on sm+ */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="order-2 sm:order-1 flex-1 py-3 text-[#283618] font-semibold border border-[#283618]/20 rounded-lg hover:bg-white/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="order-1 sm:order-2 flex-1 py-3 bg-[#BC6C25] text-white font-semibold rounded-lg hover:bg-[#a05b1f] disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Publicar"
                  )}
                </button>
              </div>

              {state?.message && !state.success && (
                <p className="text-center text-red-600 font-medium text-xs border border-red-200 bg-red-50 p-2 rounded">
                  {state.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
