"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { updateProduct } from "@/features/products/actions";
import { X, Loader2, Save } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function EditProductModal({
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateProduct, null);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.append("imageFile", imageFile);

    startTransition(() => formAction(formData));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      {/* Main Container: 
          - Added max-h-[90vh] to keep it within view
          - Added flex flex-col to separate header/body
      */}
      <div className="bg-[#FEFAE0] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#DDA15E]/30">
        {/* Fixed Header */}
        <div className="bg-[#283618] p-4 sm:p-6 flex justify-between items-center text-[#FEFAE0] shrink-0">
          <h2 className="text-lg sm:text-xl font-bold truncate mr-2">
            Editar {product.title}
          </h2>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-8 space-y-4 overflow-y-auto"
        >
          <input type="hidden" name="id" value={product.id} />

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#283618] mb-1">
                Título
              </label>
              <input
                name="title"
                defaultValue={product.title}
                required
                className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none focus:ring-2 focus:ring-[#BC6C25]"
              />
            </div>

            {/* Grid stacks on very small screens, 2-cols on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#283618] mb-1">
                  Precio ($)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product.price}
                  required
                  className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#283618] mb-1">
                  Categoría
                </label>
                <select
                  name="category"
                  defaultValue={product.category}
                  className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none"
                >
                  <option value="Cerámica">Cerámica</option>
                  <option value="Madera">Madera</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Joyería">Joyería</option>
                </select>
              </div>
            </div>

            <ImageUpload onImageProcessed={(file) => setImageFile(file)} />
            <p className="text-[10px] sm:text-xs text-gray-500 italic text-center">
              Deja vacío para mantener la imagen actual
            </p>

            <div>
              <label className="block text-sm font-bold text-[#283618] mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={product.description}
                className="w-full px-4 py-2 rounded-md border border-[#DDA15E] text-[#283618] bg-white outline-none resize-none"
              />
            </div>
          </div>

          {/* Sticky-like Footer (part of the flex-col) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 py-3 border border-[#283618]/20 rounded-lg font-medium text-[#283618] hover:bg-white/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="order-1 sm:order-2 flex-1 py-3 bg-[#606C38] text-white font-semibold rounded-lg hover:bg-[#283618] disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} /> Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
