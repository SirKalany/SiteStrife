import { notFound } from "next/navigation";

export default async function ArticlePage({ params }) {
  const { domain, slug } = params;

  // Fetch metadata
  const metaRes = await fetch(`http://localhost:4000/${domain}`, {
    cache: "no-store",
  });
  if (!metaRes.ok) notFound();
  const meta = await metaRes.json();

  const item = meta.find((x) => x.slug === slug);
  if (!item) notFound();

  // Fetch detailed content
  const contentRes = await fetch(`http://localhost:4000/${domain}/${slug}`, {
    cache: "no-store",
  });
  if (!contentRes.ok) notFound();
  const content = await contentRes.json();

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center">
      <article className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-green-400">{item.name || item.nom}</h1>

        {item.picture || item.image ? (
          <img
            src={item.picture || item.image}
            alt={item.name || item.nom}
            className="w-full max-w-xl mx-auto rounded shadow"
          />
        ) : null}

        {content.description && (
          <p className="text-gray-300">{content.description}</p>
        )}

        {content.caracteristiques && (
          <section>
            <h2 className="text-2xl text-green-300 mb-2">Specifications</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {content.caracteristiques.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        )}

        {content.development && (
          <section>
            <h2 className="text-2xl text-green-300 mb-2">Development</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {content.development}
            </p>
          </section>
        )}

        {content.service && (
          <section>
            <h2 className="text-2xl text-green-300 mb-2">Service History</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {content.service}
            </p>
          </section>
        )}
      </article>
    </main>
  );
}
