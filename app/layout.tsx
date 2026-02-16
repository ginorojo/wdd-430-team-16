/**
 * @file layout.tsx
 * @description Root layout component that provides a consistent header and footer across the application.
 * Utilizes a warm crema suave background for better visual comfort.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./ui/navbar";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Artisanal Refuge | Productos Hechos a Mano y Sostenibles",
    template: "%s | Artisanal Refuge"
  },
  description: "Conecta con los mejores artesanos locales. Descubre piezas únicas, hechas a mano con pasión y materiales sostenibles.",
  keywords: ["artesanías", "hecho a mano", "sostenible", "productos locales", "artesanal", "méxico"],
  authors: [{ name: "Artisanal Refuge Team" }],
  creator: "Artisanal Refuge",
  publisher: "Artisanal Refuge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://artisanal-refuge.vercel.app", // Adjust if needed
    siteName: "Artisanal Refuge",
    title: "Artisanal Refuge | Joyas Artesanales Locales",
    description: "Descubre el alma del arte local. Productos únicos con historia.",
    images: [
      {
        url: "/images/og-image.webp", // Ensure this exists or I'll generate one
        width: 1200,
        height: 630,
        alt: "Artisanal Refuge - Productos Únicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisanal Refuge | Arte Local",
    description: "Piezas únicas hechas a mano.",
    images: ["/images/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} text-[#283618] selection:bg-primary/30`} suppressHydrationWarning>
        <Providers>
          {/* Accessibility skip link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-white focus:text-primary focus:rounded-xl focus:shadow-2xl focus:font-bold focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Saltar al contenido principal
          </a>

          <header>
            <Navbar />
          </header>

          {/* Main Content Area */}
          <main id="main-content" className="min-h-screen outline-none" tabIndex={-1}>
            {children}
          </main>

          {/* Footer Section */}
          <footer className="bg-[#E6DAB5] text-[#1F1F1F] py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-xl font-bold mb-4">Artisanal Refuge</h2>
              <p className="max-w-md mx-auto text-gray-700 mb-8">
                Conectando el talento local con el mundo, de forma artesanal y sostenible.
              </p>
              <div className="w-full h-px bg-black/10 mb-8" />
              <p className="text-sm opacity-60">
                © 2026 Artisanal Refuge. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
