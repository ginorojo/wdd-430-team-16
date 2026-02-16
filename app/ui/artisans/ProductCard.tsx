import { Product } from "@/features/products/types";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ data }: { data: Product }) {
  return (
    <article className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300 group focus-within:ring-2 focus-within:ring-primary h-full flex flex-col">
      <div className="flex gap-2 items-center mb-3">
        <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={data.image}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {data.category}
        </span>
      </div>

      {/* Imagen Producto */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 bg-gray-100">
        <Image
          src={data.image}
          alt={`Imagen de ${data.title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info Producto */}
      <div className="flex-1">
        <Link
          href={`/product/${data.id}`}
          className="block group/link outline-none"
          aria-label={`Ver detalles de ${data.title}, precio $${data.price.toFixed(2)}`}
        >
          <h3 className="font-semibold text-[#1F1F1F] text-md mb-0.5 group-hover/link:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="font-bold text-[#1F1F1F] text-sm mb-3">
            ${data.price.toFixed(2)}
          </p>
        </Link>
      </div>

      {/* Info Autor */}
      <Link
        href={`/sellers/${data.sellerId}`}
        className="transition-transform duration-300 hover:-translate-y-1 mt-auto outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
        aria-label={`Ver perfil del artesano ${data.seller?.name || 'Artesano'}`}
      >
        <div className="flex items-center justify-start gap-2 border-t border-gray-100 pt-3">
          <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={data.seller?.profileImage || "/images/default-avatar.webp"}
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium truncate">
            {data.seller?.name}
          </span>
        </div>
      </Link>
    </article>
  );
}
