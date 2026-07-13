import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Espi — Supply Agent · Demo Spot2",
  description: "Demo interactiva del flujo de creación de cuenta vía WhatsApp con Espi, el Supply Agent de Spot2.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full ${montserrat.variable}`}>
      <body
        className="h-full antialiased"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
