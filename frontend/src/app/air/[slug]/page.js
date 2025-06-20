import { notFound } from "next/navigation";

export default async function DomaineArticlePage({ params }) {
  const { slug } = params;
  const domaine = "air";

  // Récupérer les métadonnées
  const metaRes = await fetch(`http://localhost:4000/${domaine}`, {
    cache: "no-store",
  });
  const meta = await metaRes.json();
  const item = meta.find((x) => x.slug === slug);
  if (!item) notFound();

  // Récupérer le contenu détaillé
  const contentRes = await fetch(`http://localhost:4000/${domaine}/${slug}`, {
    cache: "no-store",
  });
  if (!contentRes.ok) notFound();
  const content = await contentRes.json();

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center">
      <article className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-green-400">{item.nom}</h1>

        {item.image && (
          <img
            src={item.image}
            alt={item.nom}
            className="w-full max-w-xl mx-auto rounded shadow"
          />
        )}

        <p className="text-gray-300">{content.description}</p>

        <section>
          <h2 className="text-2xl text-green-300 mb-2">Caractéristiques</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {content.caracteristiques?.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl text-green-300 mb-2">Historique</h2>
          <p className="text-gray-300 leading-relaxed">{content.histoire}</p>
        </section>

        <section>
          <h2 className="text-2xl text-green-300 mb-2">Performances</h2>
          <p className="text-gray-300 leading-relaxed">{content.performances}</p>
        </section>

        <section>
          <h2 className="text-2xl text-green-300 mb-2">Utilisation</h2>
          <p className="text-gray-300 leading-relaxed">{content.utilisation}</p>
        </section>
      </article>
    </main>
  );
}
