import LoginForm from "../ui/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Artisanal Refuge",
  description: "Accede a tu cuenta en Artisanal Refuge para gestionar tus pedidos o tu tienda.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  );
}
