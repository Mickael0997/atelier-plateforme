import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import "./globals.css";
export const metadata: Metadata = {
  title: "Atelier — reservez en beaute",
  description: "Prise de rendez-vous beaute pour les particuliers. Espace pro separe.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="wrap">
          <AppNav />
          {children}
          <footer className="site">Cote client : rechercher et reserver. Cote pro : agenda, fiche, site — apres connexion.</footer>
        </div>
      </body>
    </html>
  );
}
