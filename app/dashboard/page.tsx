import { DM_Sans } from "next/font/google";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Administración | Artisanal Refuge",
  description: "Panel de control para la gestión de la plataforma Artisanal Refuge.",
};

// Configuración de Fuente (asegúrate de que next/font esté funcionando)
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default async function Page() {

  return (
    <div className={dmSans.className}>
      <div className="text-black">  Welcome to the Dashboard!</div>

    </div>

  );
}