export default async function ConnexionPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="hero" style={{ maxWidth: 420 }}>
      <div className="meta">Particulier</div>
      <h1>Mon compte</h1>
      <p>Demo : camille@client.atelier / client123</p>
      {sp.error && <p className="notice">Identifiants invalides.</p>}
      <form className="card" action="/api/auth/login" method="post" style={{ marginTop: 16 }}>
        <input type="hidden" name="role" value="client" />
        <input type="hidden" name="next" value={sp.next || "/compte"} />
        <label className="field" style={{ display: "block" }}>
          <div className="meta">E-mail</div>
          <input name="email" type="email" required defaultValue="camille@client.atelier" />
        </label>
        <label className="field" style={{ display: "block", marginTop: 12 }}>
          <div className="meta">Mot de passe</div>
          <input name="password" type="password" required defaultValue="client123" />
        </label>
        <button className="btn" style={{ marginTop: 16 }} type="submit">Se connecter</button>
      </form>
      <p><a href="/pro/connexion">Vous etes un professionnel de beaute ?</a></p>
    </main>
  );
}
