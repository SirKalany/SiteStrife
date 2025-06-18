export default async function HeavyPage() {
  const res = await fetch("http://localhost:3000/heavy", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur chargement domaine Heavy");
  const articles = await res.json();

  return (
    <main>
      <h1>Domaine Heavy</h1>
      <ul>
        {articles.map(({ id, nom }) => (
          <li key={id}>{nom}</li>
        ))}
      </ul>
    </main>
  );
}