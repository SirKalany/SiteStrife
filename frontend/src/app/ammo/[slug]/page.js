import { notFound } from "next/navigation";

async function fetchAmmoArticleHTML(slug) {
  const res = await fetch(`http://localhost:4000/content/ammo/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const html = await res.text();
  return html;
}

export default async function AmmoArticlePage({ params }) {
  const { slug } = await params;
  const htmlContent = await fetchAmmoArticleHTML(slug);

  if (!htmlContent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white p-8">
      <article
        className="prose prose-invert max-w-3xl mx-auto prose-li:marker:text-green-400 prose-h1:text-green-300 prose-h2:text-green-400 prose-p:text-gray-300"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </main>
  );
}
