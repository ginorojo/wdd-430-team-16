import { Product } from "@/features/products/types";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ data }: { data: Product }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex gap-2 items-center mb-3">
        <div className=" relative w-6 h-6 rounded-full overflow-hidden">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
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
          alt={data.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info Producto */}
      <Link href={`/product/${data.id}`} key={data.id}>
        <h3 className="font-semibold text-[#1F1F1F] text-md mb-0.5">
          {data.title}
        </h3>
        <p className="font-bold text-[#1F1F1F] text-sm mb-3">
          ${data.price.toFixed(2)}
        </p>
      </Link>
      {/* Info Autor */}
      <Link
        href={`/sellers/${data.sellerId}`}
        key={data.sellerId}
        className="transition-transform duration-300 hover:-translate-y-2"
      >
        <div className="flex items-center justify-start gap-2 border-t border-gray-100 pt-3">
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={data.seller?.profileImage || "/images/default-avatar.png"}
              alt={data.seller?.name || "Artesano"}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {data.seller?.name}
          </span>
        </div>
      </Link>
    </div>
  );
}
