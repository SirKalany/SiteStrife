export default async function AirPage() {
  const res = await fetch("http://localhost:3000/air", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur chargement domaine Air");
  const articles = await res.json();

  return (
    <main>
      <h1>Domaine Aérien</h1>
      <ul>
        {articles.map(({ id, nom }) => (
          <li key={id}>{nom}</li>
        ))}
      </ul>
    </main>
  );
}