import { DM_Sans } from "next/font/google";

// Configuración de Fuente (asegúrate de que next/font esté funcionando)
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default async function Page() {
 
  return (
    <div className={dmSans.className }> 
    <div className="text-black">  Welcome to the Dashboard!</div>
  
    </div>
 
  );
}