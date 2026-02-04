/**
 * @file [id]/page.tsx
 * @description Dynamic route for individual artisan profiles.
 * Fetches seller details and their associated products from MongoDB.
 */

import { notFound } from "next/navigation";
import ArtisanCard from "../../ui/ArtisanCard";
import { getSellerWithProducts } from "@/features/sellers/queries";
import NextLink from "next/link";
import Image from "next/image";

export default async function SellerProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const seller = await getSellerWithProducts(params.id);

  // Trigger 404 if seller doesn't exist
  if (!seller) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FEFAE0]">
      {/* Hero Banner Section */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={seller.heroBanner}
          alt={seller.name}
          width={500}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Profile Info Overlay */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative -mt-20 flex flex-col items-center md:items-start md:flex-row md:gap-8">
          <div className="w-40 h-40 rounded-full border-8 border-[#FEFAE0] overflow-hidden bg-gray-200 shadow-xl">
            <Image
              src={seller.profileImage}
              alt={seller.name}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-6 md:mt-24 text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#283618]">{seller.name}</h1>
            <span className="inline-block mt-2 px-3 py-1 bg-[#606C38] text-[#FEFAE0] text-sm font-medium rounded-full">
              {seller.category}
            </span>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#283618] mb-10">Sobre Mí</h2>
          <p className="text-lg text-[#283618]/80 leading-relaxed">
            {seller.bio || "Este artesano aún no ha añadido una biografía."}
          </p>
        </div>

        <hr className="my-16 border-[#DDA15E]/30" />

        {/* Products Grid */}
        <section className="pb-20">
          <h2 className="text-3xl font-bold text-[#283618] mb-10">
            Mis Productos
          </h2>

          {seller.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {seller.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#DDA15E]/20 hover:shadow-md transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <Image
                      width={500}
                      height={500}
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#283618]">
                      {product.title}
                    </h3>
                    <p className="text-[#BC6C25] font-semibold mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                    <NextLink
                      href={`/artisans/${product.id}`}
                      className="mt-auto block w-full text-center py-2 bg-[#BC6C25] text-white rounded-lg text-sm font-medium hover:bg-[#a05b1f] transition-colors"
                    >
                      Ver Detalles
                    </NextLink>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No hay productos disponibles actualmente.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
