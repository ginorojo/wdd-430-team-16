import SignupForm from "../ui/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse | Artisanal Refuge",
  description: "Crea una cuenta en Artisanal Refuge y comienza a apoyar el talento local o a vender tus creaciones.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignupForm />
    </div>
  );
}