"use client";

import { useState } from "react";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { deleteProduct } from "@/features/products/actions";
import EditProductModal from "./EditProductModal";

export default function ProductRow({ product }: { product: any }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    await deleteProduct(product.id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {/* --- DESKTOP VIEW (Visible on md and up) --- */}
      <tr className="hidden md:table-row hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="p-4">
          <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border">
            <img
              src={product.image || "/marketplace/placeholder.png"}
              className="w-full h-full object-cover"
              alt={product.title}
              onError={(e) =>
                (e.currentTarget.src = "/marketplace/placeholder.png")
              }
            />
          </div>
        </td>
        <td className="p-4 font-medium text-[#283618]">{product.title}</td>
        <td className="p-4 text-sm text-gray-600">{product.category}</td>
        <td className="p-4 text-[#BC6C25] font-bold">
          ${product.price.toFixed(2)}
        </td>
        <td className="p-4 text-right">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>

      {/* --- MOBILE VIEW (Visible on screens smaller than md) --- */}
      <div className="md:hidden bg-white p-4 border-b border-gray-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden border shrink-0">
          <img
            src={product.image || "/marketplace/placeholder.png"}
            className="w-full h-full object-cover"
            alt={product.title}
          />
        </div>

        <div className="flex-grow min-w-0">
          <h4 className="font-bold text-[#283618] truncate">{product.title}</h4>
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <p className="text-[#BC6C25] font-bold text-sm">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 text-blue-600 bg-blue-50 rounded-full"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-red-600 bg-red-50 rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL (Responsive Max-Width) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-sm w-full p-6 shadow-2xl border border-red-100 animate-in slide-in-from-bottom-4 duration-300 sm:animate-none">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={24} className="shrink-0" />
              <h3 className="font-bold text-lg leading-tight">
                ¿Eliminar producto?
              </h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Esta acción no se puede deshacer. El producto{" "}
              <strong className="text-[#283618]">{product.title}</strong> será
              borrado permanentemente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="order-2 sm:order-1 flex-1 py-3 sm:py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="order-1 sm:order-2 flex-1 py-3 sm:py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-200"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <EditProductModal
          product={product}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
