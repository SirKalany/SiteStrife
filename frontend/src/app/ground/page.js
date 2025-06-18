export default async function InfantryPage() {
  const res = await fetch("http://localhost:3000/infantry", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur chargement domaine Infantry");
  const articles = await res.json();

  return (
    <main>
      <h1>Domaine Infatry</h1>
      <ul>
        {articles.map(({ id, nom }) => (
          <li key={id}>{nom}</li>
        ))}
      </ul>
    </main>
  );
}