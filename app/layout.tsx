/**
 * @file layout.tsx
 * @description Root layout component that provides a consistent header and footer across the application.
 * Utilizes a warm crema suave background for better visual comfort.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artisanal Refuge",
  description: "Discover local artisans and connect with them",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-[#283618]`}>
        <Navbar />

        {/* Main Content Area */}
        <main className="min-h-screen">{children}</main>

        {/* Footer Section */}
        <footer className="bg-[#E6DAB5] text-[#000] py-10 text-center">
          <p className="mt-4 text-sm opacity-80">
            © 2026 Artisanal Refuge. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
