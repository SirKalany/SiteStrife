import Link from "next/link";

async function fetchItems(domain) {
  const res = await fetch(`http://localhost:4000/${domain}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
}

export default async function DomainListPage({ params }) {
  const { domain } = await params;
  let items = await fetchItems(domain);

  // Sort alphabetically by name (in English)
  items = items.sort((a, b) => a.name.localeCompare(b.name, 'en', { ignorePunctuation: true }));

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-green-400 capitalize">
        {domain} Catalog
      </h1>
      <ul className="space-y-4 w-full max-w-md">
        {items.map(({ id, name, slug, type, domain, picture }) => (
          <li
            key={id}
            className="p-4 border border-gray-600 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition"
          >
            <Link href={`/${domain}/${slug}`} className="block space-y-2">
              {picture && (
                <img
                  src={picture}
                  alt={name}
                  className="w-full h-auto rounded mb-2"
                />
              )}
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm text-gray-400">Type: {type}</p>
              <p className="text-sm text-gray-400">Domain: {domain}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
