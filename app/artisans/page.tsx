import { DM_Sans } from "next/font/google";
import Sidebar from "../ui/artisans/Sidebar";
import ProductCard from "../ui/artisans/ProductCard";
import { getProducts } from '@/features/products/queries';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar Productos | Artisanal Refuge",
  description: "Explora nuestra colección de productos artesanales únicos: cerámica, madera, textiles y más.",
};

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: Props) {
  const filters = await searchParams;

  const products = await getProducts({
    category: typeof filters.category === 'string' ? filters.category : undefined,
    material: typeof filters.material === 'string' ? filters.material : undefined,
    maxPrice: typeof filters.maxPrice === 'string' ? parseFloat(filters.maxPrice) : undefined,
  });

  return (
    <main className={`min-h-screen bg-[#F9F4EC] ${dmSans.className}`}>
      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8">
        <Sidebar />
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <p className="text-[#8D5F42] font-bold text-lg">No hay productos con estos filtros.</p>
              <p className="text-gray-400 text-sm">Prueba seleccionando otra categoría.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}