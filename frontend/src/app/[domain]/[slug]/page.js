import { notFound } from "next/navigation";

export default async function ArticlePage({ params }) {
  const { domain, slug } = await params;

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
        <h1 className="text-4xl font-bold text-green-400">
          {item.name || item.nom}
        </h1>

        {(item.picture || item.image) && (
          <img
            src={item.picture || item.image}
            alt={item.name || item.nom}
            className="w-full h-64 object-cover rounded shadow mx-auto"
          />
        )}

        {content.description && (
          <p className="text-gray-300">{content.description}</p>
        )}

        {content.caracteristiques && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">Specifications</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {content.caracteristiques.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        )}

        {content.development && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">Development</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {content.development}
            </p>
          </section>
        )}

        {content.service && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">Service History</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {content.service}
            </p>
          </section>
        )}

        {content.variants && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">
              Variants and Modifications
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {content.variants}
            </p>
          </section>
        )}

        {content.related && content.related.length > 0 && (
          <section className="border-t border-gray-700 pt-4 mt-6">
            <h2 className="text-2xl text-green-300 mb-2">Related Articles</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {content.related.map((link, i) => (
                <li key={i}>
                  <a
                    href={`/${link.domain}/${link.slug}`}
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    {link.text || link.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
