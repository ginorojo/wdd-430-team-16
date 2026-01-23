/**
 * @file page.tsx
 * @description Home page component containing the hero banner, popular categories, and featured artisan listings.
 */

import React from "react";

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gray-200 py-20 px-10 flex flex-col md:flex-row items-center justify-center gap-10">
        <h1 className="text-4xl md:text-5xl font-bold max-w-md leading-tight text-[#283618]">
          Discover local artisans, connect with them
        </h1>
        <div className="w-64 h-48 bg-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Hero Image</div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-[#F7F3E7] max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#283618]">
          Popular categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {["Ceramics", "Woodworking", "Textiles", "Jewelry"].map((item) => (
            <div
              key={item}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-4 border-transparent group-hover:border-[#DDA15E] transition-all">
                <div className="text-gray-400">Icon</div>
              </div>
              <h3 className="text-xl font-semibold text-[#606C38]">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Artisans Section */}
      <section className="bg-[#F7F3E7] py-20">
        <div className="bg-[#F7F3E7] max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-[#283618]">
            Popular artisans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{"name": "Alejandra", "specialty": "Ceramics"}, {"name": "Maria", "specialty": "Textiles"}, {"name": "Carlos", "specialty": "Woodworking"}].map((artisan) => (
              <div
                key={artisan.name}
                className="bg-white rounded-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Artisan Work</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[#283618]">
                    {artisan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {artisan.specialty}
                  </p>
                  <button className="w-full bg-[#BC6C25] text-white py-2 font-semibold rounded hover:bg-[#a05b1f] transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
