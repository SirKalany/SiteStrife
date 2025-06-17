import { notFound } from "next/navigation";

// Fonction pour aller chercher l'article et son contenu HTML
async function fetchArticle(slug) {
  const res = await fetch("http://localhost:4000/articles", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erreur lors du fetch des articles");

  const articles = await res.json();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;

  const htmlRes = await fetch(`http://localhost:4000/data/${article.id}.html`);
  const htmlContent = htmlRes.ok
    ? await htmlRes.text()
    : "<p>Contenu indisponible.</p>";

  return { ...article, htmlContent };
}

export default async function LearnSlugPage(ctx) {
  const { params } = await ctx;
  const { slug } = await params;

  const article = await fetchArticle(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-green-400 mb-4">{article.nom}</h1>
      <p className="text-gray-400 mb-6">
        Catégorie : {article.domaine} | Type : {article.type}
      </p>
      <p className="mb-8 italic text-sm text-gray-500">{article.resume}</p>

      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.htmlContent }}
      />
    </main>
  );
}
