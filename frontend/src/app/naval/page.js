export default async function NavalPage() {
  const res = await fetch("http://localhost:3000/naval", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur chargement domaine Naval");
  const articles = await res.json();

  return (
    <main>
      <h1>Domaine Naval</h1>
      <ul>
        {articles.map(({ id, nom }) => (
          <li key={id}>{nom}</li>
        ))}
      </ul>
    </main>
  );
}