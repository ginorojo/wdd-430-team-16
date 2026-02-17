'use client';

import { ChevronUp, Check } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState(searchParams.get('maxPrice') || '200');

  useEffect(() => {
    setPrice(searchParams.get('maxPrice') || '200');
  }, [searchParams]);

  const updatePriceQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('maxPrice', value);
    router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
  };

  const handleFilterClick = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Lógica para "Todos": Si el valor es vacío, borramos el filtro
    if (value === "") {
      params.delete(key);
    } else {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
  };

  const isActive = (key: string, value: string) => {
    const current = searchParams.get(key);
    // Si buscamos "Todos" (valor ""), es activo si NO hay nada en la URL
    if (value === "") return current === null;
    return current === value;
  };

  return (
    <aside className="w-64 shrink-0 pr-8 hidden md:block">
      <div className="mb-8">
        <h3 className="font-bold text-lg text-[#1F1F1F] mb-4 flex justify-between items-center">
          Categoría <ChevronUp className="w-4 h-4" />
        </h3>
        <div className="space-y-3">

          {/* OPCIÓN: TODOS LOS PRODUCTOS */}
          <label
            onClick={() => handleFilterClick('category', "")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${isActive('category', "") ? "bg-[#8D5F42] border-[#8D5F42]" : "border-[#8D5F42]/40 group-hover:border-[#8D5F42]"
              }`}>
              {isActive('category', "") && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${isActive('category', "") ? "text-[#8D5F42] font-bold" : "text-[#1F1F1F]/80 group-hover:text-[#8D5F42]"}`}>
              Todas las categorías
            </span>
          </label>

          {/* LISTA DE CATEGORÍAS */}
          {["Cerámica", "Textiles", "Joyería", "Madera"].map((item) => {
            const active = isActive('category', item);
            return (
              <label key={item} onClick={() => handleFilterClick('category', item)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${active ? "bg-[#8D5F42] border-[#8D5F42]" : "border-[#8D5F42]/40 group-hover:border-[#8D5F42]"
                  }`}>
                  {active && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${active ? "text-[#8D5F42] font-bold" : "text-[#1F1F1F]/80 group-hover:text-[#8D5F42]"}`}>{item}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg text-[#1F1F1F] mb-4">Rango de Precio</h3>
        <div className="relative py-4">
          <input
            type="range"
            min="0"
            max="200"
            step="10"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onMouseUp={() => updatePriceQuery(price)}
            className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
          />
          <div className="relative h-1 bg-[#8D5F42]/20 rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-[#8D5F42] rounded-full"
              style={{ width: `${(Number(price) / 200) * 100}%` }}
            ></div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8D5F42] rounded-full border-2 border-white shadow"
              style={{ left: `calc(${(Number(price) / 200) * 100}% - 8px)` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-xs font-medium text-[#1F1F1F]">
          <span>$0</span>
          <span className="text-[#8D5F42] font-bold">Hasta ${price}</span>
        </div>
      </div>
    </aside>
  );
}