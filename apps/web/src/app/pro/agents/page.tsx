export default function AgentsPage() {
  const agents = [
    {
      name: "Réceptionniste",
      role: "Prend un RDV par conversation.",
      tools: "search_salons, get_availability, create_booking, draft_client_message",
    },
    {
      name: "Générateur de site",
      role: "Produit une vitrine HTML à partir de la fiche établissement.",
      tools: "generate_salon_website",
    },
    {
      name: "Assistant agenda",
      role: "Résume la journée et propose des relances.",
      tools: "list_bookings, draft_client_message",
    },
  ];
  return (
    <main>
      <section className="hero">
        <h1>Agents IA</h1>
        <p>Trois agents spécifiés dans apps/agents. Serveur MCP dans apps/mcp-server.</p>
      </section>
      <div className="grid">
        {agents.map((a) => (
          <article className="card" key={a.name}>
            <div className="meta">Agent</div>
            <h3>{a.name}</h3>
            <p>{a.role}</p>
            <p className="notice">{a.tools}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
