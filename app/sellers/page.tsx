/**
 * @file page.tsx
 * @description Home page that fetches artisan data directly from MongoDB using Prisma.
 */

import { getSellers } from "@/features/sellers/queries";
import { PrismaClient } from "../../generated/prisma/client";
import ArtisanCard from "../ui/ArtisanCard";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function SellersPage() {
  const artisans = await getSellers();

  return (
    <div className="w-full bg-[#FEFAE0]">
      {/* ... Hero and Category sections from previous steps ... */}

      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold mb-12 text-[#283618]">
          Artesanos Destacados
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
              <Link 
                href={`/sellers/${artisan.id}`} 
                key={artisan.id}
                className="transition-transform duration-300 hover:-translate-y-2"
              >
                <ArtisanCard
                  bannerSrc={artisan.heroBanner}
                  profileSrc={artisan.profileImage}
                  name={artisan.name}
                  specialty={artisan.category}
                />
              </Link>
            ))}
        </div>

        {/* Handling empty states */}
        {artisans.length === 0 && (
          <p className="text-center text-gray-500">No artisans found. Did you run the seed?</p>
        )}
      </section>
    </div>
  );
}