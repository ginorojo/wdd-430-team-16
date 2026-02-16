/**
 * @file ArtisanCard.tsx
 * @description A reusable card component with a banner image, overlapping profile photo, and artisan name.
 */
import Image from "next/image";

interface ArtisanProps {
  bannerSrc: string;
  profileSrc: string;
  name: string;
  specialty: string;
}

const ArtisanCard = ({ bannerSrc, profileSrc, name, specialty }: ArtisanProps) => {
  return (
    <article className="flex flex-col items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow pb-6 group focus-within:ring-2 focus-within:ring-primary h-full">
      {/* 1. Banner Image Container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <Image
          src={bannerSrc}
          alt={`Taller de ${name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* 2. Profile Photo (The Overlapping Part) */}
      <div className="relative -mt-10 z-10">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-300 shadow-sm">
          <Image
            src={profileSrc}
            alt={`Foto de perfil de ${name}`}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3. Artisan Name */}
      <div className="mt-4 text-center px-4">
        <h3 className="text-[#1F1F1F] font-bold text-xl leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          {specialty}
        </p>
      </div>
    </article>
  );
};

export default ArtisanCard;
