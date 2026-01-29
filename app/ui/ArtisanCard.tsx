/**
 * @file ArtisanCard.tsx
 * @description A reusable card component with a banner image, overlapping profile photo, and artisan name.
 */

interface ArtisanProps {
  bannerSrc: string;
  profileSrc: string;
  name: string;
  specialty: string;
}

const ArtisanCard = ({ bannerSrc, profileSrc, name, specialty }: ArtisanProps) => {
  return (
    <div className="flex flex-col items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow pb-6">
      {/* 1. Banner Image Container */}
      <div className="relative w-full h-48 bg-gray-200">
        <img
          src={bannerSrc}
          alt={`${name} workshop`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Profile Photo (The Overlapping Part) */}
      <div className="relative -mt-10 z-10">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-300 shadow-sm">
          <img
            src={profileSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3. Artisan Name */}
      <div className="mt-3 text-center px-4">
        <h3 className="text-[#283618] font-bold text-lg leading-tight">
          {name}
        </h3>
        <p className="text-[#283618] text-md leading-tight">
          {specialty}
        </p>
      </div>
    </div>
  );
};

export default ArtisanCard;
