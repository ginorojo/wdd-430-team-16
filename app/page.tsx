/**
 * @file page.tsx
 * @description Home page component containing the hero banner, popular categories, and featured artisan listings.
 */

import React from "react";
import ArtisanCard from "./ui/ArtisanCard";
import { getBestSellers } from "@/features/sellers/queries";
import Link from "next/link";

const HomePage = async () => {
  const artisans = await getBestSellers();
  return (
    <div className="w-full">
      <section className="relative h-125 w-full flex items-center px-10 md:px-20 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.webp"
            alt="Local artisans at work"
            className="w-full h-full object-cover"
          />
          {/* Optional: Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content (Front) */}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#F7F3E7] drop-shadow-sm">
            Discover local artisans, <br />
            connect with them
          </h1>

          {/* Optional: Add a call to action button since it's a hero section */}
          <button className="mt-8 bg-[#BC6C25] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#a05b1f] transition-colors">
            Explore Now
          </button>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-[#F7F3E7] max-w-6xl mx-auto py-7 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#283618]">
          Popular categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Cerámica", picture: "ceramics.png" },
            { name: "Madera", picture: "wood.png" },
            { name: "Textiles", picture: "textiles.png" },
            { name: "Joyería", picture: "jewelry.png" },
          ].map((item) => (
            <Link
              href={`/artisans?category=${item.name}`}
              key={item.name}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-4 border-transparent group-hover:border-[#DDA15E] transition-all">
                <img src={`/images/${item.picture}`} alt={item.name} />
              </div>
              <h3 className="text-xl font-semibold text-[#606C38]">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Artisans Section */}
      <section className="bg-[#F7F3E7] py-10">
        <div className="bg-[#F7F3E7] max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-[#283618]">
            Popular artisans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      </section>
    </div>
  );
};

export default HomePage;
