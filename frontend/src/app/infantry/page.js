export default async function WeaponPage() {
  const res = await fetch("http://localhost:3000/weapon", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur chargement domaine Weapon");
  const articles = await res.json();

  return (
    <main>
      <h1>Domaine Weapon</h1>
      <ul>
        {articles.map(({ id, nom }) => (
          <li key={id}>{nom}</li>
        ))}
      </ul>
    </main>
  );
}