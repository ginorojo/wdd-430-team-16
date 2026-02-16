import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9F4EC", // El color crema del fondo
        primary: "#8D5F42",    // El color marrón de los botones/slider
        textMain: "#1F1F1F",
        textMuted: "#6B7280",
        cardBg: "#FFFFFF",
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)'], // Usaremos DM Sans que se parece mucho
      },
    },
  },
  plugins: [],
};
export default config;