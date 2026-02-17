import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seleccionar Rol | Artisanal Refuge",
    description: "Dinos cómo quieres unirte a la comunidad de Artisanal Refuge.",
};

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
