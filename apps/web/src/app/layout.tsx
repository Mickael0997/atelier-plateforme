import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier — réservation beauté",
  description: "Marketplace, agenda pro, générateur de sites et agents IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="wrap">
          <nav className="top">
            <Link className="brand" href="/">
              Atelier
            </Link>
            <div className="links">
              <Link href="/">Marketplace</Link>
              <Link href="/generateur">Générateur de site</Link>
              <Link href="/pro/agenda">Espace pro</Link>
              <Link href="/pro/agents">Agents IA</Link>
            </div>
          </nav>
          {children}
          <footer className="site">
            Starter open-source MIT · stack gratuite · MCP ready · pas un clone Planity
          </footer>
        </div>
      </body>
    </html>
  );
}
