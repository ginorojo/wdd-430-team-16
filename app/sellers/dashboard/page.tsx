/**
 * @file dashboard/page.tsx
 * @description Responsive Seller dashboard compatible con Vercel.
 */

// ✅ Cambiamos la importación local por la instancia global que configuramos
import { prisma } from "@/app/lib/prisma"; 
import ProductRow from "@/app/ui/dashboard/ProductRow";
import AddProductModal from "@/app/ui/dashboard/AddProductModal";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SellerDashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Usamos la instancia 'prisma' importada arriba
  const seller = await prisma.seller.findFirst({
    where: { email: session.user.email },
  });

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAE0] p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-[#DDA15E] max-w-md">
          <h2 className="text-2xl font-bold text-[#283618]">
            Perfil no encontrado
          </h2>
          <p className="mt-2 text-gray-600">
            Debes registrarte como artesano para acceder al panel.
          </p>
        </div>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FEFAE0] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#283618]">
              Panel de {seller.name}
            </h1>
            <p className="text-[#606C38]">Gestiona tu inventario artesanal</p>
          </div>

          <AddProductModal sellerId={seller.id} />
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#DDA15E]/20 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-black tracking-wider mb-1">
              Total Productos
            </p>
            <p className="text-3xl font-bold text-[#283618]">
              {products.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#DDA15E]/20 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-black tracking-wider mb-1">
              Categoría
            </p>
            <p className="text-xl font-bold text-[#606C38]">
              {seller.category}
            </p>
          </div>
        </div>

        {/* --- TABLE CONTAINER --- */}
        <div className="bg-white rounded-xl shadow-sm border border-[#DDA15E]/20 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="hidden md:table-header-group bg-[#606C38] text-[#FEFAE0]">
              <tr>
                <th className="p-4 text-left font-semibold">Imagen</th>
                <th className="p-4 text-left font-semibold">Producto</th>
                <th className="p-4 text-left font-semibold">Categoría</th>
                <th className="p-4 text-left font-semibold">Precio</th>
                <th className="p-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            {/* Eliminamos 'block' para mantener la estructura de tabla estándar */}
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="p-12 sm:p-20 text-center text-gray-400 italic">
              No tienes productos publicados todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}