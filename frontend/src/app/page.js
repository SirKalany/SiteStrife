import Link from "next/link";

const domains = [
  { name: "Air", path: "/Air" },
  { name: "Naval", path: "/Naval" },
  { name: "Ground", path: "/Ground" },
  { name: "Infantry", path: "/Infantry" },
  { name: "Heavy", path: "/Heavy" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-green-400">Armement - Catalogue</h1>

      {/* Navigation buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {domains.map(({ name, path }) => (
          <Link key={name} href={path} className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg text-center shadow">
            {name}
          </Link>
        ))}
      </div>
    </main>
  );
}
