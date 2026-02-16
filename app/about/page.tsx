import React from "react";
import Image from "next/image";

export const metadata = {
  title: "Sobre Nosotros | Artisanal Refuge",
  description: "Conoce al equipo de desarrolladores Full Stack detrás de Artisanal Refuge.",
};

export default function About() {
  return (
    <main className="flex flex-col gap-12 py-12 min-h-screen bg-[#F9F4EC] px-8 text-gray-800 font-sans">
      <section className="max-w-4xl mx-auto text-center flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          Detrás de Artisanal Refuge
        </h1>

        <div className="flex flex-col gap-4 text-lg leading-relaxed text-gray-800">
          <p>
            Somos un equipo de desarrolladores en formación de BYU-Pathway
            Worldwide, unidos por una meta común: crear tecnología que empodere a
            los creadores locales.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full">
        <h2 className="sr-only">Nuestro Equipo de Desarrollo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* --- GINO --- */}
          <article className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="relative w-32 h-32 mb-2">
              {/* ASEGÚRATE DE TENER ESTA FOTO EN TU CARPETA PUBLIC */}
              <Image
                src="/images/gino-pic_11zon.jpg"
                alt="Foto de Gino Rojo"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <header>
              <h3 className="font-bold text-xl text-gray-800">Gino Rojo</h3>
              <p className="text-gray-800 text-xs font-bold uppercase tracking-wider mt-1">
                Full Stack Developer
              </p>
            </header>
            <p className="text-gray-800 text-sm leading-relaxed">
              Lideró el desarrollo del Marketplace y la lógica avanzada de
              filtros de búsqueda, facilitando el descubrimiento intuitivo de
              productos.
            </p>
          </article>

          {/* --- CRISTIAN --- */}
          <article className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="relative w-32 h-32 mb-2">
              {/* ASEGÚRATE DE TENER ESTA FOTO EN TU CARPETA PUBLIC */}
              <Image
                src="/images/cristian-pic_11zon.jpg"
                alt="Foto de Cristian De La Hoz"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <header>
              <h3 className="font-bold text-xl text-gray-800">Cristian De La Hoz</h3>
              <p className="text-gray-800 text-xs font-bold uppercase tracking-wider mt-1">
                Full Stack Developer
              </p>
            </header>
            <p className="text-gray-800 text-sm leading-relaxed">
              Implementó el carrito de compras y optimizó la experiencia de
              usuario (UX) y SEO, asegurando un flujo de navegación eficiente.
            </p>
          </article>

          {/* --- DAVID --- */}
          <article className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="relative w-32 h-32 mb-2">
              {/* ASEGÚRATE DE TENER ESTA FOTO EN TU CARPETA PUBLIC */}
              <Image
                src="/images/david.jpg"
                alt="Foto de David Balladares"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <header>
              <h3 className="font-bold text-xl text-gray-800">David Balladares</h3>
              <p className="text-gray-800 text-xs font-bold uppercase tracking-wider mt-1">
                Full Stack Developer
              </p>
            </header>
            <p className="text-gray-800 text-sm leading-relaxed">
              Diseñó la estructura de la base de datos e integró la pasarela de
              pagos, garantizando la seguridad en las transacciones.
            </p>
          </article>

          {/* --- FRANCISCO --- */}
          <article className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="relative w-32 h-32 mb-2">
              {/* ASEGÚRATE DE TENER ESTA FOTO EN TU CARPETA PUBLIC */}
              <Image
                src="/images/francisco-pic_11zon.jpeg"
                alt="Foto de Francisco"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <header>
              <h3 className="font-bold text-xl text-gray-800">Francisco</h3>
              <p className="text-gray-800 text-xs font-bold uppercase tracking-wider mt-1">
                Full Stack Developer
              </p>
            </header>
            <p className="text-gray-800 text-sm leading-relaxed">
              Desarrolló el Home Page y el Dashboard de administración, creando
              herramientas robustas para la gestión de productos.
            </p>
          </article>

        </div>
      </section>
    </main>
  );
}