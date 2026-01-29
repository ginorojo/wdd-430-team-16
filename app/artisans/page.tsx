import { DM_Sans } from "next/font/google";
import { Navbar } from "../lib/ui/navbar";
import Sidebar from "@/app/lib/ui/artisans/Sidebar"
import ProductCard from "@/app/lib/ui/artisans/ProductCard"
import { products } from "@/app/lib/ui/data";
// Configuración de Fuente (asegúrate de que next/font esté funcionando)
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function Home() {
  return (
    // Aplicamos el color de fondo crema directamente aquí: bg-[#F9F4EC]
    <main className={`min-h-screen bg-[#F9F4EC] ${dmSans.className}`}>

      
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