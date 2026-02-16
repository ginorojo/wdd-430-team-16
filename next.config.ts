import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  // Permitir orígenes de desarrollo en la red local (evita la advertencia dev)
  allowedDevOrigins:
    process.env.NODE_ENV === "development"
      ? [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://192.168.1.198:3000",
          "http://192.168.1.198:3001",
          "http://192.168.1.198",
        ]
      : undefined,
};

export default nextConfig;