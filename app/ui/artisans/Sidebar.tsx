import { ChevronUp } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 pr-8 hidden md:block">
      {/* Sección Categoría */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 cursor-pointer">
          <h3 className="font-bold text-lg text-[#1F1F1F]">Categoría</h3>
          <ChevronUp className="w-4 h-4 text-[#1F1F1F]" />
        </div>
        <div className="space-y-3">
          {["Cerámica", "Textiles", "Joyería", "Madera"].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 border-2 border-[#8D5F42]/40 rounded flex items-center justify-center group-hover:border-[#8D5F42] transition-colors">
                 {/* Aquí iría un check si estuviera seleccionado */}
              </div>
              <span className="text-[#1F1F1F]/80 text-sm group-hover:text-[#8D5F42] transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sección Rango de Precio */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-[#1F1F1F]">Rango de Precio</h3>
        </div>
        {/* Barra del Slider */}
        <div className="relative h-1 bg-[#8D5F42]/20 rounded-full mb-4 mt-2">
            <div className="absolute left-0 top-0 h-full w-2/3 bg-[#8D5F42] rounded-full"></div>
            {/* Botones del Slider */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8D5F42] rounded-full border-2 border-white shadow cursor-pointer"></div>
            <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8D5F42] rounded-full border-2 border-white shadow cursor-pointer"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-[#1F1F1F]">
            <span>$.300</span>
            <span>500 - $1,000</span>
        </div>
      </div>

      {/* Sección Material */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-[#1F1F1F]">Material</h3>
          <ChevronUp className="w-4 h-4 text-[#1F1F1F]" />
        </div>
        <div className="space-y-3">
          {["Cerámica", "Textiles", "Joyería", "Madera", "Edano"].map((item, idx) => (
            <label key={`${item}-${idx}`} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 border-2 border-[#8D5F42]/40 rounded group-hover:border-[#8D5F42] transition-colors"></div>
              <span className="text-[#1F1F1F]/80 text-sm group-hover:text-[#8D5F42] transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}