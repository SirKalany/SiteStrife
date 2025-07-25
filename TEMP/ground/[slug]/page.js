import { notFound } from "next/navigation";

export default async function DomaineArticlePage({ params }) {
  const { slug } = await params;
  const domaine = "ground";

  // Récupérer les métadonnées
  const metaRes = await fetch(`http://localhost:4000/${domaine}`, {
    cache: "no-store",
  });
  const meta = await metaRes.json();
  const item = meta.find((x) => x.slug === slug);
  if (!item) notFound();

  const contentRes = await fetch(`http://localhost:4000/${domaine}/${slug}`, {
    cache: "no-store",
  });
  if (!contentRes.ok) notFound();
  const content = await contentRes.json();

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white px-10 py-12 flex flex-col items-center">
      <article className="w-full max-w-4xl space-y-10">
        <h1 className="text-4xl font-bold text-green-400 text-center">
          {item.nom}
        </h1>

        {item.image && (
          <figure className="w-full">
            <img
              src={item.image}
              alt={item.nom}
              className="w-full rounded shadow"
            />
            <figcaption className="text-sm text-gray-400 text-center mt-2 italic">
              {item.caption
                ? item.caption
                : `Photo of the ${item.nom}.`}
            </figcaption>
          </figure>
        )}

        {content.description && (
          <section>
            <p className="text-gray-300 text-lg leading-relaxed">
              {content.description}
            </p>
          </section>
        )}

        {content.caracteristiques?.length > 0 && (
          <section>
            <h2 className="text-2xl text-green-300 mb-2">Characteristics</h2>
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
            {content.development.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-300 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </section>
        )}

        {content.service && (
          <section>
            <h2 className="text-2xl text-green-300 mb-2">Service</h2>
            {content.service.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-300 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </section>
        )}

        {content.variants && (
          <section>
            <h2 className="text-2xl text-green-300 mb-2">
              Models and variants
            </h2>
            {content.variants.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-300 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </section>
        )}
      </article>
    </main>
  );
}
