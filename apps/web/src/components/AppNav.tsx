import Link from "next/link";
import { getSession } from "@/lib/auth";
export async function AppNav() {
  const session = await getSession();
  if (session?.role === "pro") {
    return (
      <nav className="top">
        <Link className="brand" href="/pro/agenda">Atelier Pro</Link>
        <div className="links">
          <Link href="/pro/agenda">Agenda</Link>
          <Link href="/pro/etablissement">Etablissement</Link>
          <Link href="/pro/site">Mon site</Link>
          <Link href="/pro/agents">Agents</Link>
          <Link href="/">Marketplace</Link>
          <span className="meta">{session.name}</span>
          <form action="/api/auth/logout" method="post">
            <button className="btn ghost" type="submit">Deconnexion</button>
          </form>
        </div>
      </nav>
    );
  }
  return (
    <nav className="top">
      <Link className="brand" href="/">Atelier</Link>
      <div className="links">
        <Link href="/">Rechercher</Link>
        {session ? (
          <>
            <Link href="/compte">Mes rendez-vous</Link>
            <span className="meta">{session.name}</span>
            <form action="/api/auth/logout" method="post">
              <button className="btn ghost" type="submit">Deconnexion</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/connexion">Mon compte</Link>
            <Link href="/pro/connexion">Vous etes professionnel ?</Link>
          </>
        )}
      </div>
    </nav>
  );
}
