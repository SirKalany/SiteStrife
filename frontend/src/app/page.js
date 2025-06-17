import Link from "next/link";

async function fetchArticles() {
  const res = await fetch("http://localhost:4000/articles", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export default async function Home() {
  const articles = await fetchArticles();

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold mb-8 text-green-400">Armement - Catalogue</h1>
      <ul className="space-y-4 w-full max-w-md">
        {articles.map(({ id, nom, domaine, slug }) => (
          <li key={id} className="p-4 border border-gray-600 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition">
            <Link href={`/learn/${slug}`} className="block">
              <h2 className="text-xl font-bold">{nom}</h2>
              <p className="text-sm text-gray-400">Catégorie : {domaine}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
