import Link from "next/link";

async function fetchData() {
  const res = await fetch("http://localhost:4000/ground", { cache: "no-store" });
  if (!res.ok) throw new Error("Échec du chargement des données");
  return res.json();
}

export default async function Page() {
  const items = await fetchData();

  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-green-400">
        Ground Equipment Catalog
      </h1>
      <ul className="space-y-4 w-full max-w-md">
        {items.map(({ id, nom, slug, type, domaine, image }) => (
          <li
            key={id}
            className="p-4 border border-gray-600 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition"
          >
            <Link href={`/ground/${slug}`} className="block space-y-2">
              {image && (
                <img
                  src={image}
                  alt={nom}
                  className="w-full h-auto rounded mb-2"
                />
              )}
              <h2 className="text-xl font-bold">{nom}</h2>
              <p className="text-sm text-gray-400">Type : {type}</p>
              <p className="text-sm text-gray-400">Domaine : {domaine}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
