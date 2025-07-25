export default async function AmmoArticlePage({ params }) {
  const { slug } = await params;

  // 1. Récupérer les métadonnées (ammo.json)
  const metaRes = await fetch("http://localhost:4000/ammo", { cache: "no-store" });
  const meta = await metaRes.json();
  const item = meta.find((x) => x.slug === slug);
  if (!item) notFound();

  // 2. Récupérer le contenu (content/ammo/slug.json)
  const contentRes = await fetch(`http://localhost:4000/ammo/${slug}`, { cache: "no-store" });
  if (!contentRes.ok) notFound();
  const content = await contentRes.json();

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white flex justify-center px-4 py-10">
      <article className="w-full max-w-4xl px-6 sm:px-10 lg:px-20 bg-[#0b0b0b] rounded-xl py-[30px]">
        <h1 className="text-4xl font-bold text-green-400 mb-6">{item.nom}</h1>

        {item.image && (
          <img
            src={item.image}
            alt={item.nom}
            className="w-full max-w-lg mb-8 rounded shadow-lg"
          />
        )}

        <p className="text-gray-300 mb-10 leading-relaxed">{content.description}</p>

        <section className="mb-10">
          <h2 className="text-2xl text-green-300 mb-3">Caractéristiques</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {content.caracteristiques.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl text-green-300 mb-3">Historique</h2>
          <p className="text-gray-300 leading-relaxed">{content.histoire}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl text-green-300 mb-3">Performances</h2>
          <p className="text-gray-300 leading-relaxed">{content.performances}</p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl text-green-300 mb-3">Utilisation</h2>
          <p className="text-gray-300 leading-relaxed">{content.utilisation}</p>
        </section>
      </article>
    </main>
  );
}
