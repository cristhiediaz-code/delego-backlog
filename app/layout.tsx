import type { Metadata } from "next";
import "./globals.css";
import { FeaturesProvider } from "@/lib/context";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Delego Backlog",
  description: "Gestión de backlog priorizado por votos de clientes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <FeaturesProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </FeaturesProvider>
      </body>
    </html>
  );
}
