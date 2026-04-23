import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKKAZ.io — Vendez en 10 secondes",
  description: "Générez des annonces parfaites en un clic et vendez plus vite sur toutes les plateformes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
