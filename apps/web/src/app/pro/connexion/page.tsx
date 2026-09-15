export default async function ProConnexionPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="hero" style={{ maxWidth: 460 }}>
      <div className="meta">Espace professionnel</div>
      <h1>Connexion Pro</h1>
      <p>Demo : lea@atelier-nation.pro / pro123</p>
      {sp.error && <p className="notice">Identifiants invalides.</p>}
      <form className="card" action="/api/auth/login" method="post" style={{ marginTop: 16 }}>
        <input type="hidden" name="role" value="pro" />
        <input type="hidden" name="next" value={sp.next || "/pro/agenda"} />
        <label className="field" style={{ display: "block" }}>
          <div className="meta">E-mail professionnel</div>
          <input name="email" type="email" required defaultValue="lea@atelier-nation.pro" />
        </label>
        <label className="field" style={{ display: "block", marginTop: 12 }}>
          <div className="meta">Mot de passe</div>
          <input name="password" type="password" required defaultValue="pro123" />
        </label>
        <button className="btn" style={{ marginTop: 16 }} type="submit">Entrer dans l espace pro</button>
      </form>
    </main>
  );
}
