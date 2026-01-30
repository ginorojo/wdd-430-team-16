import { DM_Sans } from "next/font/google";
import Sidebar from "../ui/artisans/Sidebar";
import ProductCard from "../ui/artisans/ProductCard";
import { getProducts } from '@/features/products/queries';
// Configuración de Fuente (asegúrate de que next/font esté funcionando)
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default async function Home() {
  const products = await getProducts();
  console.log(products);
  return (
    // Aplicamos el color de fondo crema directamente aquí: bg-[#F9F4EC]
    <main className={`min-h-screen bg-[#F9F4EC] ${dmSans.className}`}>

D
      
      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8">
        {/* Barra Lateral */}
        <Sidebar />

        {/* Grilla de Productos */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}