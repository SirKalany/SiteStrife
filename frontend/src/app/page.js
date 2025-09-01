import Link from "next/link";

const domains = [
  { name: "Air", path: "/air", img: "/airimage.jpg" },
  { name: "Naval", path: "/naval", img: "/navalimage.jpg" },
  { name: "Ground", path: "/ground", img: "/groundimage.jpg" },
  { name: "Infantry", path: "/infantry", img: "/infantryimage.jpg" },
  { name: "Heavy", path: "/heavy", img: "/heavyimage.jpg" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1b1b1b] text-white flex flex-col px-4 pt-10 pb-4">
      {/* Titre en haut */}
      <h1 className="text-3xl font-semibold text-green-400 text-center">
        Armement - Catalogue
      </h1>

      {/* Bloc centré verticalement */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-8">
        {/* Ligne du haut : 3 boutons */}
        <div className="flex flex-wrap justify-center gap-6">
          {domains.slice(0, 3).map(({ name, path, img }) => (
            <Link
              key={name}
              href={path}
              className="relative w-[300px] h-40 rounded-lg shadow-lg overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url('${img}')` }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))",
                }}
              >
                <span className="text-lg font-bold text-green-400">{name}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Ligne du bas : 2 boutons */}
        <div className="flex flex-wrap justify-center gap-6">
          {domains.slice(3).map(({ name, path, img }) => (
            <Link
              key={name}
              href={path}
              className="relative w-[300px] h-40 rounded-lg shadow-lg overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url('${img}')` }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))",
                }}
              >
                <span className="text-lg font-bold text-green-400">{name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
